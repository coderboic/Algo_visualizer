import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import {
  Play,
  Terminal,
  Code2,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Loader2,
  Copy,
  Download,
} from 'lucide-react';
import toast from 'react-hot-toast';

const PlaygroundPage: React.FC = () => {
  const [code, setCode] = useState(getDefaultCode('javascript'));
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [activeTab, setActiveTab] = useState<'output' | 'error'>('output');
  const [aiSuggestion, setAiSuggestion] = useState<{
    fixedCode: string;
    explanation: string;
    changes: string[];
  } | null>(null);

  const editorRef = useRef<any>(null);

  const handleCodeChange = (value: string | undefined) => {
    setCode(value || '');
    setAiSuggestion(null); // Clear AI suggestions when code changes
  };

  const handleRunCode = async () => {
    setActiveTab('output');
    setOutput('Executing code...\n');
    setError('');
    setIsExecuting(true);

    try {
      const response = await fetch('http://localhost:5000/api/playground/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          input: '',
        }),
      });

      const result = await response.json();

      if (result.error) {
        setError(result.error);
        setOutput('');
        setActiveTab('error');
        toast.error('Code execution failed');
      } else {
        setOutput(result.output || 'Program completed successfully');
        setError('');
        toast.success(`Executed in ${result.executionTime}ms`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to execute code');
      setActiveTab('error');
      toast.error('Execution failed');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleFixWithAI = async () => {
    if (!error && !code.trim()) {
      toast.error('No code to fix');
      return;
    }

    setIsFixing(true);
    toast.loading('AI is analyzing your code...', { id: 'ai-fix' });

    try {
      const response = await fetch('http://localhost:5000/api/playground/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          error: error || undefined,
        }),
      });

      const result = await response.json();

      if (result.error) {
        toast.error(result.error, { id: 'ai-fix' });
      } else {
        setAiSuggestion(result);
        toast.success('AI has analyzed your code!', { id: 'ai-fix' });
      }
    } catch (err: any) {
      toast.error('AI fix failed: ' + err.message, { id: 'ai-fix' });
    } finally {
      setIsFixing(false);
    }
  };

  const handleApplyFix = () => {
    if (aiSuggestion) {
      setCode(aiSuggestion.fixedCode);
      setAiSuggestion(null);
      toast.success('AI fix applied!');
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(getDefaultCode(newLanguage));
    setOutput('');
    setError('');
    setAiSuggestion(null);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  const handleDownloadCode = () => {
    const extensions: Record<string, string> = {
      javascript: 'js',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      typescript: 'ts',
    };

    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${extensions[language] || 'txt'}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Code downloaded');
  };

  function getDefaultCode(lang: string) {
    const templates: Record<string, string> = {
      javascript: `// JavaScript Code
function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("World"));`,

      python: `# Python Code
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))`,

      java: `// Java Code
public class Main {
    public static void main(String[] args) {
        System.out.println(greet("World"));
    }

    public static String greet(String name) {
        return "Hello, " + name + "!";
    }
}`,

      cpp: `// C++ Code
#include <iostream>
#include <string>
using namespace std;

string greet(string name) {
    return "Hello, " + name + "!";
}

int main() {
    cout << greet("World") << endl;
    return 0;
}`,

      typescript: `// TypeScript Code
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`,
    };

    return templates[lang] || templates.javascript;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-[calc(100vh-128px)] flex flex-col bg-gray-50 dark:bg-gray-900"
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
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="typescript">TypeScript</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center"
              title="Copy Code"
            >
              <Copy className="h-4 w-4" />
            </button>

            <button
              onClick={handleDownloadCode}
              className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center"
              title="Download Code"
            >
              <Download className="h-4 w-4" />
            </button>

            <button
              onClick={handleFixWithAI}
              disabled={isFixing}
              className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 flex items-center"
            >
              {isFixing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              AI Fix
            </button>

            <button
              onClick={handleRunCode}
              disabled={isExecuting}
              className="px-4 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
            >
              {isExecuting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              Run Code
            </button>
          </div>
        </div>
      </div>

      {/* AI Suggestion Banner */}
      {aiSuggestion && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-b border-purple-200 dark:border-purple-800 px-4 py-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">AI Code Suggestion</h3>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{aiSuggestion.explanation}</p>
              {aiSuggestion.changes.length > 0 && (
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {aiSuggestion.changes.map((change, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {change}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex space-x-2 ml-4">
              <button
                onClick={handleApplyFix}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm font-medium"
              >
                Apply Fix
              </button>
              <button
                onClick={() => setAiSuggestion(null)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-medium"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Panel */}
        <div className="flex-1 flex flex-col">
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={handleCodeChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              padding: { top: 16 },
            }}
            onMount={(editor) => {
              editorRef.current = editor;
            }}
          />
        </div>

        {/* Output Panel */}
        <div className="w-2/5 border-l border-gray-200 dark:border-gray-700 flex flex-col bg-white dark:bg-gray-800">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('output')}
              className={`px-4 py-2.5 text-sm font-medium flex items-center ${
                activeTab === 'output'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Terminal className="h-4 w-4 mr-2" />
              Output
            </button>
            <button
              onClick={() => setActiveTab('error')}
              className={`px-4 py-2.5 text-sm font-medium flex items-center ${
                activeTab === 'error'
                  ? 'text-red-600 dark:text-red-400 border-b-2 border-red-600 dark:border-red-400 bg-red-50 dark:bg-red-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Errors
              {error && <span className="ml-2 px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded-full">1</span>}
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto p-4">
            {activeTab === 'output' && (
              <div>
                {output ? (
                  <pre className="text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                    {output}
                  </pre>
                ) : (
                  <div className="text-center py-12 text-gray-400 dark:text-gray-500">
                    <Terminal className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Run your code to see output here</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'error' && (
              <div>
                {error ? (
                  <div className="space-y-3">
                    <div className="flex items-start p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                      <pre className="text-sm font-mono text-red-700 dark:text-red-300 whitespace-pre-wrap flex-1">
                        {error}
                      </pre>
                    </div>
                    <button
                      onClick={handleFixWithAI}
                      disabled={isFixing}
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 flex items-center justify-center"
                    >
                      {isFixing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                      )}
                      Fix with AI
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400 dark:text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No errors found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlaygroundPage;
