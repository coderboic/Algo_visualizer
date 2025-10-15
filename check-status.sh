#!/bin/bash

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         🎉 AI Playground Status Check                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check Backend
echo "🔍 Checking Backend (Port 5000)..."
if curl -s http://localhost:5000 > /dev/null 2>&1; then
    echo "   ✅ Backend is RUNNING"
else
    echo "   ❌ Backend is NOT running"
fi
echo ""

# Check Frontend  
echo "🔍 Checking Frontend (Port 5174)..."
if curl -s http://localhost:5174 > /dev/null 2>&1; then
    echo "   ✅ Frontend is RUNNING"
elif curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "   ✅ Frontend is RUNNING on port 5173"
else
    echo "   ❌ Frontend is NOT running"
fi
echo ""

# Check API Endpoints
echo "🔍 Checking API Endpoints..."

# Test /languages
echo -n "   GET /api/playground/languages ... "
LANG_RESPONSE=$(curl -s http://localhost:5000/api/playground/languages)
if [[ $LANG_RESPONSE == *"javascript"* ]]; then
    echo "✅"
else
    echo "❌"
fi

# Test /execute
echo -n "   POST /api/playground/execute ... "
EXEC_RESPONSE=$(curl -s -X POST http://localhost:5000/api/playground/execute \
    -H "Content-Type: application/json" \
    -d '{"code": "console.log(\"Hello\")", "language": "javascript"}')
if [[ $EXEC_RESPONSE == *"Hello"* ]] || [[ $EXEC_RESPONSE == *"output"* ]]; then
    echo "✅"
else
    echo "❌"
fi

# Test /fix (AI)
echo -n "   POST /api/playground/fix (AI) ... "
FIX_RESPONSE=$(curl -s -X POST http://localhost:5000/api/playground/fix \
    -H "Content-Type: application/json" \
    -d '{"code": "function test( { console.log(\"test\") }", "language": "javascript"}')
if [[ $FIX_RESPONSE == *"fixedCode"* ]] || [[ $FIX_RESPONSE == *"explanation"* ]]; then
    echo "✅"
else
    echo "⚠️  (Response: ${FIX_RESPONSE:0:50}...)"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                  🚀 QUICK ACCESS LINKS                     ║"
echo "╠════════════════════════════════════════════════════════════╣"
echo "║  Playground:  http://localhost:5174/playground             ║"
echo "║  Frontend:    http://localhost:5174                        ║"
echo "║  Backend:     http://localhost:5000                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
