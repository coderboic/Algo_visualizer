# 🔒 Security & Environment Setup

## ⚠️ IMPORTANT: API Keys and Secrets

This project uses the **Google Gemini API** for AI-powered code fixes. You MUST set up your own API key.

### 🔑 Getting Your Gemini API Key

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 📝 Setup Instructions

#### 1. Create Environment File

In the `backend` directory, create a `.env` file:

```bash
cd backend
cp .env.example .env
```

#### 2. Add Your API Key

Edit `backend/.env` and replace `your_gemini_api_key_here` with your actual API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

#### 3. Verify Setup

```bash
cd backend
npm install
npm start
```

You should see:
```
🚀 Server is running on http://localhost:5000
```

### 🚫 What NOT to Do

❌ **NEVER** commit `.env` file to Git
❌ **NEVER** share your API key publicly
❌ **NEVER** hardcode API keys in source code
❌ **NEVER** push `.env` to GitHub

### ✅ What IS Safe to Commit

✅ `.env.example` - Template without real keys
✅ Source code - No hardcoded secrets
✅ Documentation - No sensitive data

### 🔐 Files Protected by .gitignore

The following files/patterns are automatically excluded from Git:

- `.env` and all variants (`.env.local`, `.env.production`, etc.)
- Any file containing API keys or secrets
- `node_modules/`
- `dist/` and build directories
- Test scripts that may contain credentials
- Shell scripts with `-key.sh` pattern

### 📋 Environment Variables Used

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Backend server port | No | 5000 |
| `NODE_ENV` | Environment mode | No | development |
| `FRONTEND_URL` | Frontend URL for CORS | No | http://localhost:5173 |
| `GEMINI_API_KEY` | Google Gemini API key | **YES** | - |

### 🛡️ Best Practices

1. **Keep `.env` local** - Never commit it
2. **Use `.env.example`** - Template for others
3. **Rotate keys regularly** - Change API keys periodically
4. **Limit API key permissions** - Use minimal required access
5. **Monitor usage** - Check API usage dashboard
6. **Use environment-specific keys** - Different keys for dev/prod

### 🔄 If Your Key is Exposed

If you accidentally commit your API key:

1. **Immediately revoke** the key at https://makersuite.google.com/app/apikey
2. **Generate new key**
3. **Update `.env`** file
4. **Remove from Git history** (see below)

#### Remove from Git History

```bash
# Install BFG Repo-Cleaner
# Then run:
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch backend/.env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (CAUTION: This rewrites history)
git push origin --force --all
```

### 📞 Support

If you have issues with API keys or environment setup:

1. Check `.env.example` for template
2. Verify API key is valid
3. Check console for error messages
4. See `HOW_TO_GET_GEMINI_KEY.md` for detailed guide

### ✅ Quick Checklist

Before pushing to GitHub:

- [ ] `.env` file is NOT staged for commit
- [ ] `.env.example` has placeholder values only
- [ ] No API keys in source code
- [ ] `.gitignore` is properly configured
- [ ] Test scripts with credentials are excluded
- [ ] Documentation doesn't contain secrets

---

**Remember: Security first! 🔒**
