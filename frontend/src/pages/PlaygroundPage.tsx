import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import {
  Play,
  Terminal,
  Code2,
  Users,
  Share2,
  Check,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setCustomCode, setLanguage, executeAlgorithm } from '../store/slices/executionSlice';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';

interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  passed?: boolean;
}

const PlaygroundPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { customCode, language, isExecuting } = useAppSelector((state) => state.execution);
  const { theme } = useAppSelector((state) => state.ui);
  
  const [code, setCode] = useState(customCode || getDefaultCode(language));
  const [output, setOutput] = useState('');
  const [testCases, setTestCases] = useState<TestCase[]>([
    {
      id: '1',
      input: '[5, 2, 8, 1, 9]',
      expectedOutput: '[1, 2, 5, 8, 9]',
    },
  ]);
  const [activeTab, setActiveTab] = useState<'code' | 'output' | 'test'>('code');
  const [isCollaborative, setIsCollaborative] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  
  const socketRef = useRef<Socket | null>(null);
  const editorRef = useRef<any>(null);

  // Initialize socket connection for collaborative editing
  useEffect(() => {
    if (isCollaborative && roomId) {
      socketRef.current = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000');
      
      socketRef.current.emit('join-room', {
        roomId,
        userId: 'user-' + Math.random().toString(36).substr(2, 9),
        username: 'Anonymous',
      });

      socketRef.current.on('code-update', (data) => {
        if (editorRef.current) {
          setCode(data.code);
        }
      });

      socketRef.current.on('user-joined', (data) => {
        toast.success(`${data.username} joined the session`);
        setCollaborators(prev => [...prev, data]);
      });

      socketRef.current.on('user-left', (data) => {
        toast(`${data.username} left the session`);
        setCollaborators(prev => prev.filter(c => c.userId !== data.userId));
      });

      return () => {
        socketRef.current?.emit('leave-room', roomId);
        socketRef.current?.disconnect();
      };
    }
  }, [isCollaborative, roomId]);

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    dispatch(setCustomCode(newCode));

    // Broadcast code changes in collaborative mode
    if (isCollaborative && socketRef.current) {
      socketRef.current.emit('code-change', {
        roomId,
        code: newCode,
        changes: null,
      });
    }
  };

  const handleRunCode = async () => {
    setActiveTab('output');
    setOutput('Running code...\n');

    try {
      // Simulate code execution (in real app, this would call the backend)
      const result = await dispatch(
        executeAlgorithm({
          algorithmId: 'custom',
          input: testCases[0]?.input || '[]',
          customCode: code,
        })
      ).unwrap();

      setOutput(JSON.stringify(result, null, 2));

      // Broadcast execution result in collaborative mode
      if (isCollaborative && socketRef.current) {
        socketRef.current.emit('code-result', {
          roomId,
          result,
        });
      }
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    }
  };

  const handleRunTests = () => {
    setActiveTab('test');
    // Run test cases
    testCases.forEach((testCase) => {
      // Simulate test execution
      testCase.actualOutput = '[1, 2, 5, 8, 9]'; // This would come from actual execution
      testCase.passed = testCase.actualOutput === testCase.expectedOutput;
    });
    setTestCases([...testCases]);
  };

  const handleStartCollaboration = () => {
    const newRoomId = 'room-' + Math.random().toString(36).substr(2, 9);
    setRoomId(newRoomId);
    setIsCollaborative(true);
    toast.success('Collaborative session started!');
  };

  const handleCopyRoomLink = () => {
    const link = `${window.location.origin}/playground?room=${roomId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Room link copied to clipboard!');
  };

  const handleLanguageChange = (newLanguage: any) => {
    dispatch(setLanguage(newLanguage));
    setCode(getDefaultCode(newLanguage));
  };

  function getDefaultCode(lang: string) {
    const templates: Record<string, string> = {
      javascript: `// JavaScript Solution
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

// Test the function
const input = [5, 2, 8, 1, 9];
console.log(bubbleSort(input));`,
      
      python: `# Python Solution
def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                # Swap elements
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

# Test the function
input_arr = [5, 2, 8, 1, 9]
print(bubble_sort(input_arr))`,
      
      java: `// Java Solution
import java.util.Arrays;

public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // Swap elements
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
    
    public static void main(String[] args) {
        int[] input = {5, 2, 8, 1, 9};
        bubbleSort(input);
        System.out.println(Arrays.toString(input));
    }
}`,
      
      cpp: `// C++ Solution
#include <iostream>
#include <vector>
using namespace std;

void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}

int main() {
    vector<int> input = {5, 2, 8, 1, 9};
    bubbleSort(input);
    
    for (int num : input) {
        cout << num << " ";
    }
    return 0;
}`,
    };
    
    return templates[lang] || templates.javascript;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-[calc(100vh-128px)] flex flex-col"
    >
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <Code2 className="mr-2 h-5 w-5" />
              Code Playground
            </h1>
            
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            {!isCollaborative ? (
              <button
                onClick={handleStartCollaboration}
                className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
              >
                <Users className="mr-2 h-4 w-4" />
                Start Collaboration
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Room: {roomId}
                </span>
                <button
                  onClick={handleCopyRoomLink}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                </button>
                {collaborators.length > 0 && (
                  <div className="flex -space-x-2">
                    {collaborators.slice(0, 3).map((collab, i) => (
                      <div
                        key={i}
                        className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-gray-800"
                        title={collab.username}
                      >
                        {collab.username.charAt(0).toUpperCase()}
                      </div>
                    ))}
                    {collaborators.length > 3 && (
                      <div className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-gray-800">
                        +{collaborators.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleRunCode}
              disabled={isExecuting}
              className="px-4 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
            >
              <Play className="mr-2 h-4 w-4" />
              Run
            </button>

            <button
              onClick={handleRunTests}
              className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <Terminal className="mr-2 h-4 w-4" />
              Run Tests
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Editor Panel */}
        <div className="flex-1 flex flex-col">
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={handleCodeChange}
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
            }}
            onMount={(editor) => {
              editorRef.current = editor;
            }}
          />
        </div>

        {/* Output Panel */}
        <div className="w-1/3 border-l border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('output')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'output'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Output
            </button>
            <button
              onClick={() => setActiveTab('test')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'test'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Test Cases
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto p-4">
            {activeTab === 'output' && (
              <pre className="text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                {output || 'Run your code to see output here...'}
              </pre>
            )}

            {activeTab === 'test' && (
              <div className="space-y-4">
                {testCases.map((testCase) => (
                  <div
                    key={testCase.id}
                    className={`p-3 rounded-lg border ${
                      testCase.passed === undefined
                        ? 'border-gray-300 dark:border-gray-600'
                        : testCase.passed
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Test Case #{testCase.id}
                      </span>
                      {testCase.passed !== undefined && (
                        <span
                          className={`text-sm font-medium ${
                            testCase.passed ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {testCase.passed ? 'Passed' : 'Failed'}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Input: </span>
                        <code className="text-gray-800 dark:text-gray-200">{testCase.input}</code>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Expected: </span>
                        <code className="text-gray-800 dark:text-gray-200">
                          {testCase.expectedOutput}
                        </code>
                      </div>
                      {testCase.actualOutput && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Actual: </span>
                          <code className="text-gray-800 dark:text-gray-200">
                            {testCase.actualOutput}
                          </code>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlaygroundPage;