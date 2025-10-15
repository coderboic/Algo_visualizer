# 🌐 AlgoBook - Access Guide

## 🚀 Application URLs

### Main Application
**Frontend**: http://localhost:5173
- Homepage with all features
- Full navigation
- All visualizers accessible

### Backend API
**Backend Server**: http://localhost:5000
- RESTful API endpoints
- WebSocket support
- Algorithm execution

**Health Check**: http://localhost:5000/health
- Verify backend is running
- Returns server status

## 📍 Direct Links to Visualizers

### Data Structures
| Visualizer | URL | Description |
|------------|-----|-------------|
| **Array** | http://localhost:5173/visualizer/array | Insert, delete, search operations |
| **Stack** | http://localhost:5173/visualizer/stack | LIFO operations, push, pop, peek |
| **Queue** | http://localhost:5173/visualizer/queue | FIFO operations, enqueue, dequeue |
| **Linked List** | http://localhost:5173/visualizer/linked-list | Node operations, traversal |

### Sorting Algorithms
| Algorithm | URL | Complexity |
|-----------|-----|------------|
| **Bubble Sort** | http://localhost:5173/visualizer/bubble-sort | O(n²) |
| **Selection Sort** | http://localhost:5173/visualizer/selection-sort | O(n²) |
| **Insertion Sort** | http://localhost:5173/visualizer/insertion-sort | O(n²) |
| **Merge Sort** | http://localhost:5173/visualizer/merge-sort | O(n log n) |
| **Quick Sort** | http://localhost:5173/visualizer/quick-sort | O(n log n) |

### Search Algorithms
| Algorithm | URL | Complexity |
|-----------|-----|------------|
| **Searching** | http://localhost:5173/visualizer/searching | Linear & Binary |
| **Linear Search** | http://localhost:5173/visualizer/linear-search | O(n) |
| **Binary Search** | http://localhost:5173/visualizer/binary-search | O(log n) |

### Navigation Pages
| Page | URL | Purpose |
|------|-----|---------|
| **Home** | http://localhost:5173/ | Landing page |
| **Algorithms** | http://localhost:5173/algorithms | Browse all algorithms |
| **Data Structures** | http://localhost:5173/algorithms/data-structures | Data structure category |
| **Sorting** | http://localhost:5173/algorithms/sorting | Sorting category |
| **Searching** | http://localhost:5173/algorithms/searching | Search category |
| **Playground** | http://localhost:5173/playground | Code playground |

## 🎯 Quick Access Scenarios

### Scenario 1: Learn Data Structures (Beginner)
```
1. Array: http://localhost:5173/visualizer/array
   → Try inserting and searching

2. Stack: http://localhost:5173/visualizer/stack  
   → Push and pop elements

3. Queue: http://localhost:5173/visualizer/queue
   → Enqueue and dequeue

4. Linked List: http://localhost:5173/visualizer/linked-list
   → Insert and traverse
```

### Scenario 2: Compare Sorting Algorithms
```
1. Start with Bubble Sort:
   http://localhost:5173/visualizer/bubble-sort
   
2. Then try Quick Sort:
   http://localhost:5173/visualizer/quick-sort
   
3. Use same input array to compare!
```

### Scenario 3: Master Search Algorithms
```
1. Open Searching visualizer:
   http://localhost:5173/visualizer/searching
   
2. Try Linear Search first
3. Then switch to Binary Search
4. Compare step counts!
```

### Scenario 4: Classroom Demo
```
1. Homepage: http://localhost:5173/
2. Navigate to category
3. Select algorithm
4. Use 0.5x speed for detailed explanation
```

## 📱 Mobile Access (if on same network)

If you want to access from mobile/tablet on same network:

1. Find your computer's IP:
   ```bash
   # On Linux/Mac:
   ip addr show | grep "inet "
   # Or
   ifconfig | grep "inet "
   ```

2. Use IP instead of localhost:
   ```
   http://YOUR-IP:5173
   # Example: http://192.168.1.100:5173
   ```

3. Make sure both devices are on same WiFi

## 🔌 API Endpoints

### Algorithm Management
```
GET  /api/algorithms              # Get all algorithms
GET  /api/algorithms/:id          # Get specific algorithm
GET  /api/algorithms/category/:cat # Get by category
```

### Algorithm Execution
```
POST /api/execute/algorithm       # Execute algorithm
GET  /api/execute/status/:id      # Check execution status
POST /api/execute/validate        # Validate input
```

### Visualization
```
POST /api/visualize/generate      # Generate visualization
GET  /api/visualize/:id           # Get visualization data
```

### Example API Call
```bash
# Test backend health
curl http://localhost:5000/health

# Get all algorithms
curl http://localhost:5000/api/algorithms

# Execute bubble sort
curl -X POST http://localhost:5000/api/execute/algorithm \
  -H "Content-Type: application/json" \
  -d '{"algorithmId": "bubble-sort", "input": {"array": [5,2,8,1,9]}}'
```

## 🎮 Keyboard Shortcuts (Planned)

When on a visualizer page:
- **Space**: Play/Pause
- **→**: Step Forward  
- **←**: Step Backward
- **R**: Reset
- **1-4**: Speed selection

## 🌈 Browser Recommendations

### Best Experience
1. **Chrome** (Recommended)
   - Best performance
   - Full feature support
   - DevTools integration

2. **Firefox**
   - Good performance
   - Privacy-focused
   - Developer tools

3. **Safari** (Mac)
   - Native Mac integration
   - Good performance

4. **Edge** (Windows)
   - Chromium-based
   - Windows integration

### Minimum Versions
- Chrome: 80+
- Firefox: 75+
- Safari: 13+
- Edge: 80+

## 📊 Server Status Commands

### Check if servers are running
```bash
# Backend (should show port 5000)
lsof -i :5000

# Frontend (should show port 5173)
lsof -i :5173
```

### Start servers if not running
```bash
# Backend
cd backend
npm run dev

# Frontend (in new terminal)
cd frontend  
npm run dev
```

### Stop servers
```bash
# Press Ctrl+C in terminal where server is running
# Or kill process:
kill -9 $(lsof -t -i:5000)  # Backend
kill -9 $(lsof -t -i:5173)  # Frontend
```

## 🎓 Learning Resources

### Documentation
- **Quick Start**: [QUICKSTART.md](./QUICKSTART.md)
- **Full Guide**: [IMPLEMENTATION_README.md](./IMPLEMENTATION_README.md)
- **Testing**: [VERIFICATION_REPORT.md](./VERIFICATION_REPORT.md)
- **Summary**: [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)

### Video Tutorials (Future)
- Introduction to AlgoBook
- Data Structure Operations
- Sorting Algorithm Comparison
- Search Algorithm Mastery

## 🔧 Developer Access

### Development Tools
```
Frontend DevTools: http://localhost:5173
Backend Logs: Terminal where backend is running
Redux DevTools: Available in browser extension
```

### Debugging
```
# Frontend console
Open browser DevTools (F12)
Check Console, Network, React tabs

# Backend logs
Check terminal output
Look for error messages
```

## 🎯 Bookmarks to Add

Add these to your browser bookmarks:

**Essential**
- 🏠 Home: http://localhost:5173/
- 📚 All Algorithms: http://localhost:5173/algorithms
- ⚙️ Backend Health: http://localhost:5000/health

**Data Structures**
- Array: http://localhost:5173/visualizer/array
- Stack: http://localhost:5173/visualizer/stack
- Queue: http://localhost:5173/visualizer/queue
- Linked List: http://localhost:5173/visualizer/linked-list

**Sorting**
- Bubble Sort: http://localhost:5173/visualizer/bubble-sort
- Quick Sort: http://localhost:5173/visualizer/quick-sort

**Searching**
- Search Visualizer: http://localhost:5173/visualizer/searching

## 📱 QR Code Access (Optional)

Generate QR code for mobile access:
```
URL: http://YOUR-IP:5173
Tool: Use any QR code generator online
Scan: From mobile device to open directly
```

## 🆘 Troubleshooting Access

### Can't access frontend
```
1. Check if server is running: lsof -i :5173
2. Try: http://127.0.0.1:5173
3. Clear browser cache
4. Try incognito/private mode
```

### Can't access backend
```
1. Check if server is running: lsof -i :5000
2. Check terminal for errors
3. Try: curl http://localhost:5000/health
4. Restart backend server
```

### Network errors
```
1. Check if both servers are running
2. Check CORS settings (should allow localhost)
3. Check firewall settings
4. Restart both servers
```

## ✅ Verification Checklist

Before using the application:
- [ ] Backend running (http://localhost:5000)
- [ ] Frontend running (http://localhost:5173)
- [ ] Health check passing (http://localhost:5000/health)
- [ ] Homepage loads successfully
- [ ] Can navigate to visualizers
- [ ] Controls are responsive

## 🎉 You're All Set!

**Main Access Point**: http://localhost:5173

Start exploring and happy learning! 🚀📚

---

**Last Updated**: October 14, 2025
**Version**: 1.0.0
**Status**: ✅ Operational
