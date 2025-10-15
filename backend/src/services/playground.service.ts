import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

interface CodeExecutionRequest {
  code: string;
  language: string;
  input?: string;
}

interface CodeExecutionResult {
  output: string;
  error?: string;
  executionTime?: number;
}

interface AIFixRequest {
  code: string;
  language: string;
  error?: string;
}

interface AIFixResult {
  fixedCode: string;
  explanation: string;
  changes: string[];
}

class PlaygroundService {
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    // Initialize Gemini AI if API key is available
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('🔑 GEMINI_API_KEY status:', apiKey ? `Present (${apiKey.substring(0, 10)}...)` : 'Not found');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      console.log('✅ Google Generative AI initialized successfully');
    } else {
      console.warn('⚠️  Gemini AI not initialized - API key missing');
    }
  }

  // Execute code using external API (Piston API or similar)
  async executeCode(request: CodeExecutionRequest): Promise<CodeExecutionResult> {
    const startTime = Date.now();

    try {
      // Map language names to Piston API language identifiers
      const languageMap: Record<string, string> = {
        javascript: 'javascript',
        python: 'python',
        java: 'java',
        cpp: 'cpp',
        c: 'c',
        csharp: 'csharp',
        go: 'go',
        rust: 'rust',
        typescript: 'typescript',
      };

      const pistonLanguage = languageMap[request.language.toLowerCase()] || request.language;

      // Use Piston API for code execution (free and open-source)
      const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
        language: pistonLanguage,
        version: '*', // Use latest version
        files: [
          {
            name: `main.${this.getFileExtension(request.language)}`,
            content: request.code,
          },
        ],
        stdin: request.input || '',
        args: [],
        compile_timeout: 10000,
        run_timeout: 3000,
        compile_memory_limit: -1,
        run_memory_limit: -1,
      });

      const executionTime = Date.now() - startTime;

      if (response.data.run) {
        return {
          output: response.data.run.stdout || response.data.run.stderr || '',
          error: response.data.run.stderr || undefined,
          executionTime,
        };
      } else if (response.data.compile) {
        return {
          output: '',
          error: response.data.compile.stderr || 'Compilation failed',
          executionTime,
        };
      }

      return {
        output: '',
        error: 'Unknown execution error',
        executionTime,
      };
    } catch (error: any) {
      return {
        output: '',
        error: error.message || 'Code execution failed',
        executionTime: Date.now() - startTime,
      };
    }
  }

  // Fix code using Google Gemini AI
  async fixCodeWithAI(request: AIFixRequest): Promise<AIFixResult> {
    console.log('🔧 fixCodeWithAI called, genAI status:', this.genAI ? 'initialized' : 'null');
    
    if (!this.genAI) {
      throw new Error('Gemini API key not configured. Please set GEMINI_API_KEY in environment variables.');
    }

    try {
      console.log('🤖 Requesting AI fix for', request.language, 'code');
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `You are an expert programmer. Analyze and fix the following ${request.language} code.

${request.error ? `The code has the following error:\n${request.error}\n\n` : ''}Code to fix:
\`\`\`${request.language}
${request.code}
\`\`\`

IMPORTANT: You must respond with ONLY valid JSON in this exact format, nothing else:
{
  "fixedCode": "corrected code here",
  "explanation": "brief explanation of what was wrong",
  "changes": ["change 1", "change 2", "change 3"]
}

Do not include any markdown formatting, code blocks, or additional text. Only return the JSON object.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log('🤖 AI Response received, length:', text.length);

      // Try to extract JSON from the response - handle markdown code blocks
      let jsonText = text;
      
      // Remove markdown code blocks if present
      const codeBlockMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (codeBlockMatch) {
        jsonText = codeBlockMatch[1];
      } else {
        // Try to find JSON object directly
        const jsonMatch = text.match(/\{[\s\S]*?\}(?=\s*(?:```|$))/);
        if (jsonMatch) {
          jsonText = jsonMatch[0];
        }
      }

      try {
        const parsed = JSON.parse(jsonText);
        console.log('✅ Successfully parsed JSON response');
        return {
          fixedCode: parsed.fixedCode || request.code,
          explanation: parsed.explanation || 'Code has been analyzed and fixed.',
          changes: parsed.changes || [],
        };
      } catch (parseError: any) {
        console.error('❌ JSON parse error:', parseError.message);
        console.log('Raw AI response:', text.substring(0, 500));
        
        // Fallback: try to extract code and explanation manually
        return {
          fixedCode: request.code,
          explanation: 'AI provided suggestions but response format was unexpected. Please check the code manually.',
          changes: ['Could not parse AI response - please review manually'],
        };
      }
    } catch (error: any) {
      console.error('❌ AI fix error:', error.message);
      throw new Error(`AI fix failed: ${error.message}`);
    }
  }

  // Analyze code for potential issues
  async analyzeCode(code: string, language: string): Promise<{ issues: string[]; suggestions: string[] }> {
    if (!this.genAI) {
      return {
        issues: ['Gemini API not configured'],
        suggestions: ['Set GEMINI_API_KEY environment variable to enable AI analysis'],
      };
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `Analyze the following ${language} code for potential issues, bugs, and improvements:

\`\`\`${language}
${code}
\`\`\`

Provide:
1. List of potential issues or bugs
2. List of suggestions for improvement

Format as JSON:
{
  "issues": ["issue 1", "issue 2"],
  "suggestions": ["suggestion 1", "suggestion 2"]
}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          issues: parsed.issues || [],
          suggestions: parsed.suggestions || [],
        };
      }

      return {
        issues: [],
        suggestions: ['Code analysis completed'],
      };
    } catch (error: any) {
      return {
        issues: [`Analysis error: ${error.message}`],
        suggestions: [],
      };
    }
  }

  private getFileExtension(language: string): string {
    const extensions: Record<string, string> = {
      javascript: 'js',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      csharp: 'cs',
      go: 'go',
      rust: 'rs',
      typescript: 'ts',
    };
    return extensions[language.toLowerCase()] || 'txt';
  }

  // Get supported languages
  getSupportedLanguages() {
    return [
      { id: 'javascript', name: 'JavaScript', version: 'Node.js' },
      { id: 'python', name: 'Python', version: '3.x' },
      { id: 'java', name: 'Java', version: 'JDK 11+' },
      { id: 'cpp', name: 'C++', version: 'C++17' },
      { id: 'c', name: 'C', version: 'C11' },
      { id: 'typescript', name: 'TypeScript', version: 'Latest' },
      { id: 'go', name: 'Go', version: 'Latest' },
      { id: 'rust', name: 'Rust', version: 'Latest' },
    ];
  }
}

export const playgroundService = new PlaygroundService();
