# Code Playground with AI Fix Feature - Setup Guide

## 🎯 Overview

The Code Playground now supports:
- ✅ Multi-language code execution (JavaScript, Python, Java, C++, TypeScript)
- ✅ AI-powered code error detection and fixing using Google Gemini Flash
- ✅ Real-time code execution with Piston API
- ✅ Beautiful UI with error highlighting
- ✅ Code download and copy functionality

## 🚀 Setup Instructions

### 1. Get Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create/Update `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Add your Gemini API key to `.env`:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

### 3. Install Dependencies

```bash
# Backend dependencies (already installed)
cd backend
npm install

# Frontend dependencies (if needed)
cd ../frontend
npm install
```

### 4. Start the Application

```bash
# Terminal 1 - Backend
cd backend
npm run build
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🎮 How to Use

### Basic Code Execution

1. Navigate to **http://localhost:5173/playground**
2. Select your programming language from the dropdown
3. Write or modify the code in the editor
4. Click **"Run Code"** to execute
5. View output in the Output panel

### AI Code Fixing

#### Method 1: Fix Errors Automatically
1. Write code with intentional or unintentional errors
2. Click **"Run Code"** 
3. If there are errors, they'll appear in the "Errors" tab
4. Click **"Fix with AI"** button in the error panel
5. AI will analyze and provide a fixed version
6. Review the suggested changes
7. Click **"Apply Fix"** to use the corrected code

#### Method 2: General Code Improvement
1. Write any code
2. Click the **"AI Fix"** button in the header (purple gradient button)
3. AI will analyze your code for:
   - Syntax errors
   - Logic errors
   - Performance improvements
   - Best practices
4. Review suggestions and apply if needed

### Supported Languages

- **JavaScript**: Node.js runtime
- **Python**: Python 3.x
- **Java**: JDK 11+
- **C++**: C++17
- **TypeScript**: Latest version

## 📡 API Endpoints

### Code Execution
```http
POST /api/playground/execute
Content-Type: application/json

{
  "code": "console.log('Hello World');",
  "language": "javascript",
  "input": ""  // optional stdin
}
```

### AI Code Fix
```http
POST /api/playground/fix
Content-Type: application/json

{
  "code": "your code here",
  "language": "javascript",
  "error": "optional error message"
}
```

### Get Supported Languages
```http
GET /api/playground/languages
```

## 🧪 Testing the Features

### Test 1: Basic Execution
```javascript
// JavaScript example
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

console.log(factorial(5)); // Should output: 120
```

### Test 2: Error Detection & Fix
```javascript
// JavaScript with error (missing semicolon, wrong syntax)
function greet(name {
  console.log("Hello, " + name
}

greet("World")
```

1. Run this code - it will fail
2. Click "Fix with AI"
3. AI will correct the syntax errors
4. Apply the fix and run again

### Test 3: Python Example
```python
# Python with logical error
def sum_numbers(arr):
    total = 0
    for num in arr
        total += num  # Missing colon
    return total

print(sum_numbers([1, 2, 3, 4, 5]))
```

### Test 4: Java Example
```java
// Java with compilation error
public class Test {
    public static void main(String[] args) {
        System.out.println("Hello World")  // Missing semicolon
    }
}
```

## 🔧 Architecture

### Backend Services

1. **PlaygroundService** (`backend/src/services/playground.service.ts`)
   - Code execution via Piston API
   - AI integration with Google Gemini Flash
   - Code analysis and fixing

2. **Playground Routes** (`backend/src/routes/playground.routes.ts`)
   - `/execute` - Run code
   - `/fix` - Fix code with AI
   - `/analyze` - Analyze code quality
   - `/languages` - Get supported languages

### Frontend Components

- **PlaygroundPage** (`frontend/src/pages/PlaygroundPage.tsx`)
  - Monaco Editor for code editing
  - Split panel layout
  - AI suggestions display
  - Error handling UI

## 🎨 Features

### UI Features
- ✅ Dark mode support
- ✅ Syntax highlighting
- ✅ Auto-completion
- ✅ Code formatting
- ✅ Copy to clipboard
- ✅ Download code
- ✅ Error highlighting
- ✅ AI suggestion banner

### AI Features
- ✅ Automatic error detection
- ✅ Code correction suggestions
- ✅ Explanation of fixes
- ✅ List of changes made
- ✅ One-click apply fix

### Code Execution
- ✅ Real-time execution
- ✅ Multi-language support
- ✅ Execution time tracking
- ✅ STDOUT/STDERR capture
- ✅ Compilation error handling

## 🐛 Troubleshooting

### AI Fix Not Working
- **Issue**: "Gemini API key not configured"
- **Solution**: Add `GEMINI_API_KEY` to backend `.env` file

### Code Execution Fails
- **Issue**: Network error or timeout
- **Solution**: Check Piston API availability or try again
- **Alternative**: The service uses `https://emkc.org/api/v2/piston/execute` (free tier)

### Backend Not Starting
- **Issue**: Port already in use
- **Solution**: Kill existing process or change PORT in `.env`

```bash
# Kill process on port 5000
pkill -f "node.*dist/index.js"
# or
lsof -ti:5000 | xargs kill
```

## 📝 Example Workflow

1. **Write Code** → User writes Python code with a bug
2. **Execute** → Click "Run Code" → Error appears
3. **AI Analysis** → Click "Fix with AI" → AI analyzes the error
4. **Review Fix** → See suggested changes and explanation
5. **Apply** → Click "Apply Fix" → Corrected code replaces original
6. **Re-run** → Click "Run Code" → Success! ✅

## 🔐 Security Notes

- API keys are stored server-side only (never exposed to frontend)
- Code execution happens in isolated containers (Piston API)
- No code is permanently stored
- Rate limiting should be implemented for production use

## 📚 Resources

- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Piston API Docs](https://github.com/engineer-man/piston)
- [Monaco Editor Docs](https://microsoft.github.io/monaco-editor/)

## 🎉 What's New

- 🆕 Multi-language IDE in browser
- 🆕 AI-powered error fixing with Gemini Flash
- 🆕 Real-time code execution
- 🆕 Beautiful error display with quick fixes
- 🆕 Code download and sharing features
- 🆕 Dark mode support throughout

---

**Status**: ✅ Fully functional and ready to use!

The playground is now a complete online IDE with AI assistance! 🚀
