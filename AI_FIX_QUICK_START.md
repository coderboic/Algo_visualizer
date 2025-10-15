# 🤖 AI Code Fix Feature - Quick Start

## Getting Your Gemini API Key

### Step 1: Visit Google AI Studio
Go to: **https://makersuite.google.com/app/apikey**

### Step 2: Sign In
Use your Google account to sign in

### Step 3: Create API Key
1. Click **"Create API Key"** button
2. Select or create a project
3. Copy the generated API key

### Step 4: Add to Backend
```bash
# Navigate to backend directory
cd /home/rishabh/Desktop/projects/Algo_visualizer/backend

# Edit .env file
nano .env  # or use any editor
```

Add this line:
```env
GEMINI_API_KEY=your_actual_api_key_here
```

### Step 5: Restart Backend
```bash
npm run build
npm start
```

## ✅ Testing the AI Fix Feature

### Test 1: JavaScript Syntax Error
1. Go to `http://localhost:5173/playground`
2. Select **JavaScript**
3. Paste this buggy code:
```javascript
function add(a, b {
  return a + b
}
console.log(add(5, 3))
```
4. Click **"Run Code"** → Error appears
5. Click **"AI Fix"** → AI analyzes
6. Click **"Apply Fix"** → Code corrected!
7. Click **"Run Code"** → Success! Output: 8

### Test 2: Python Logic Error
1. Select **Python**
2. Paste this code:
```python
def is_even(n):
    if n % 2 = 0:  # Wrong operator
        return True
    return False

print(is_even(4))
```
3. Click **"Run Code"** → Error
4. Click **"AI Fix"** → Get suggestion
5. Apply and run → Works!

### Test 3: C++ Compilation Error
1. Select **C++**
2. Paste:
```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello World"  // Missing semicolon
    return 0;
}
```
3. Run → Error
4. AI Fix → Corrected
5. Apply → Success!

## 🎯 How AI Fix Works

1. **Detects Issues**
   - Syntax errors
   - Logic errors
   - Missing semicolons/brackets
   - Wrong operators
   - Type mismatches

2. **Provides Solutions**
   - Fixed code
   - Explanation of issues
   - List of changes made

3. **One-Click Apply**
   - Review suggestions
   - Click "Apply Fix"
   - Code automatically updated

## 🌟 Pro Tips

- 💡 You can use AI Fix even without running code first
- 💡 AI Fix works for code optimization too, not just errors
- 💡 Try different languages - AI understands them all
- 💡 Review changes before applying for learning
- 💡 Use "Copy Code" to save your work

## ⚡ Keyboard Shortcuts

- **Ctrl/Cmd + Enter**: Run Code
- **Ctrl/Cmd + S**: Download Code
- **Ctrl/Cmd + C**: Copy Code (when editor focused)

## 🔥 Cool Features to Try

1. **Auto-Fix Chain**
   - Write buggy code
   - AI fixes it
   - Run successfully
   - Learn from mistakes!

2. **Multi-Language Testing**
   - Try same algorithm in different languages
   - Compare outputs
   - Learn syntax differences

3. **Code Improvement**
   - Write working code
   - Use AI Fix anyway
   - Get optimization suggestions

## 📊 What AI Can Fix

✅ Syntax Errors (missing brackets, semicolons)
✅ Logic Errors (wrong operators, conditions)
✅ Compilation Errors (type mismatches)
✅ Runtime Errors (division by zero hints)
✅ Best Practice Violations (code style)
✅ Performance Issues (inefficient code)

## 🚫 Current Limitations

- AI requires internet connection
- Free Gemini API has rate limits
- Very complex errors may need manual fixing
- AI suggestions should be reviewed

## 🎮 Example Workflow

```
Write Code → Run → Error? → AI Fix → Review → Apply → Run → Success! 🎉
```

---

**The AI Fix feature makes learning to code easier and faster!** 🚀

No more frustration with syntax errors - let AI help you learn and fix issues instantly.
