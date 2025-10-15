# 🚀 Quick Setup - Adding Gemini API Key

## Method 1: Using the Setup Script (Easiest)

```bash
# Make the script executable
chmod +x setup-gemini-key.sh

# Run the script
./setup-gemini-key.sh
```

The script will:
1. Guide you to get the API key
2. Prompt you to paste it
3. Automatically update the .env file
4. Show you next steps

---

## Method 2: Manual Setup

### Step 1: Get Your API Key

1. Open: **https://makersuite.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API Key"** button
4. Copy the generated key (starts with `AIza...`)

### Step 2: Add to .env File

```bash
# Open the .env file
cd /home/rishabh/Desktop/projects/Algo_visualizer/backend
nano .env

# Or use any text editor
code .env   # VS Code
gedit .env  # Gedit
vi .env     # Vi/Vim
```

### Step 3: Update the Line

Find this line:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Replace `your_gemini_api_key_here` with your actual API key:
```env
GEMINI_API_KEY=AIzaSyABC123XYZ789_your_actual_key_here
```

### Step 4: Save the File

- **Nano**: Press `Ctrl+X`, then `Y`, then `Enter`
- **VS Code**: Press `Ctrl+S`
- **Vi/Vim**: Press `Esc`, type `:wq`, press `Enter`

### Step 5: Restart Backend

```bash
cd /home/rishabh/Desktop/projects/Algo_visualizer/backend
npm start
```

---

## Method 3: One-Line Command

```bash
# Replace YOUR_KEY_HERE with your actual API key
echo "GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" >> backend/.env
```

**Example:**
```bash
echo "GEMINI_API_KEY=AIzaSyABC123DEF456GHI789" >> backend/.env
```

---

## Verify Setup

### Check if API key is set:
```bash
cat backend/.env | grep GEMINI_API_KEY
```

Should show:
```
GEMINI_API_KEY=AIzaSy... (your key)
```

### Test the API:

```bash
# Make sure backend is running
cd backend && npm start

# In another terminal, test the AI fix endpoint
curl -X POST http://localhost:5000/api/playground/fix \
  -H "Content-Type: application/json" \
  -d '{
    "code": "function test( { console.log(\"test\") }",
    "language": "javascript"
  }'
```

If successful, you'll get a JSON response with fixed code!

---

## 🎯 Current .env File Location

```
/home/rishabh/Desktop/projects/Algo_visualizer/backend/.env
```

The file is already created with this template:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key_here  ← Replace this!
```

---

## ⚠️ Important Security Notes

1. **Never commit .env to Git**
   - Already in .gitignore
   - Contains sensitive data

2. **Keep your API key secret**
   - Don't share publicly
   - Don't paste in public forums

3. **Free tier limits**
   - 60 requests per minute
   - Plenty for development!

---

## 🐛 Troubleshooting

### Error: "Gemini API key not configured"
**Solution**: API key not set or incorrect format
```bash
# Check current value
grep GEMINI_API_KEY backend/.env

# Make sure it starts with AIza and is 39 characters
```

### Error: "API key invalid"
**Solution**: Key might be wrong
1. Go back to https://makersuite.google.com/app/apikey
2. Copy the key again
3. Update .env file
4. Restart backend

### Backend won't start
**Solution**: 
```bash
# Kill any existing process
pkill -f "node.*dist/index.js"

# Restart
cd backend
npm start
```

---

## ✅ Quick Checklist

- [ ] Got API key from Google AI Studio
- [ ] Added to backend/.env file
- [ ] Key starts with "AIza"
- [ ] Saved the file
- [ ] Restarted backend server
- [ ] Tested at http://localhost:5173/playground

---

**Ready to use AI Fix!** 🎉

Once setup is complete, the playground will have AI-powered code fixing capabilities!
