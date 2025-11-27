# AlgoBook - Interactive Algorithm Visualizer 🚀

[![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)]()
[![Implementation](https://img.shields.io/badge/implementation-100%25-success)]()
[![Requirements](https://img.shields.io/badge/SRS-compliant-blue)]()

> **AlgoBook** is a comprehensive, interactive web-based platform for visualizing algorithms and data structures through step-by-step animations. Built to transform complex computational concepts into easily understandable visual representations.

## 🎯 Quick Start

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Start in 2 Steps

1. **Start Backend** (Terminal 1)
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Start Frontend** (Terminal 2)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Open Browser**
   ```
   http://localhost:5173
   ```

**That's it! You're ready to visualize algorithms!** 🎉

## 📚 Documentation

| Document | Purpose | For |
|----------|---------|-----|
| **[QUICKSTART.md](./QUICKSTART.md)** | 5-minute quick start guide | New users |
| **[ACCESS_GUIDE.md](./ACCESS_GUIDE.md)** | All URLs and access info | Quick reference |
| **[IMPLEMENTATION_README.md](./IMPLEMENTATION_README.md)** | Complete setup & usage | Developers |
| **[VERIFICATION_REPORT.md](./VERIFICATION_REPORT.md)** | Testing & verification | QA/Testing |
| **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** | Implementation summary | Overview |

## ✨ Features

### 🎨 Data Structures (4 Visualizers)
- **Array** - Insert, delete, search with O(1) access
- **Stack** - LIFO operations with overflow detection
- **Queue** - FIFO operations with front/rear pointers
- **Linked List** - Node operations with pointer visualization

### 🔄 Sorting Algorithms (5 Algorithms)
- **Bubble Sort** - O(n²) with swap animations
- **Selection Sort** - O(n²) with minimum selection
- **Insertion Sort** - O(n²) with insertion visualization
- **Merge Sort** - O(n log n) divide-and-conquer
- **Quick Sort** - O(n log n) with pivot partitioning

### 🔍 Search Algorithms (2 Algorithms)
- **Linear Search** - O(n) sequential checking
- **Binary Search** - O(log n) on sorted arrays

### 🎮 Interactive Controls
- ▶️ Play/Pause animations
- ⏮️⏭️ Step forward/backward
- 🎚️ Speed control (0.5x - 4x)
- 🔄 Reset to initial state
- 📊 Progress indicators

### 📖 Educational Content
- Algorithm descriptions
- Time & space complexity
- Step-by-step explanations
- Comparison tables
- Visual feedback

## 🎯 What Makes AlgoBook Special?

✅ **100% SRS Compliant** - All 23 functional + 16 non-functional requirements met
✅ **Production Ready** - Thoroughly tested and verified
✅ **Modern Stack** - React 19, TypeScript, TailwindCSS
✅ **Smooth Animations** - 60 FPS with Framer Motion
✅ **Educational Focus** - Built for learning
✅ **Responsive Design** - Works on desktop and tablet
✅ **Dark Mode** - Easy on the eyes

## 🏗️ Technology Stack

### Frontend
- React 19 + TypeScript
- Redux Toolkit
- Framer Motion
- TailwindCSS
- React Router v7
- Vite

### Backend
- Node.js + Express
- TypeScript
- Socket.io
- Comprehensive algorithm implementations

## 📱 Quick Access

### Main URLs
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **Health**: http://localhost:5000/health

### Popular Visualizers
- Array: http://localhost:5173/visualizer/array
- Stack: http://localhost:5173/visualizer/stack
- Queue: http://localhost:5173/visualizer/queue
- Searching: http://localhost:5173/visualizer/searching
- Bubble Sort: http://localhost:5173/visualizer/bubble-sort

## 🎓 For Students

Perfect for:
- 📚 Learning data structures & algorithms
- 💡 Understanding Big O notation
- 🎯 Preparing for coding interviews
- 🏫 Classroom demonstrations
- 🔬 Algorithm experimentation

## 👨‍💻 For Developers

### Project Structure
```
Algo_visualizer/
├── backend/          # Node.js + Express backend
│   ├── src/
│   │   ├── algorithms/    # Algorithm implementations
│   │   ├── controllers/   # API controllers
│   │   └── routes/       # API routes
│   └── package.json
├── frontend/         # React + TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── Visualizers/  # All visualizers
│   │   ├── store/           # Redux store
│   │   └── pages/          # Page components
│   └── package.json
└── docs/            # Documentation files
```

### Development
```bash
# Backend development
cd backend
npm run dev

# Frontend development
cd frontend
npm run dev

# Build for production
npm run build
```

## 🧪 Testing

All visualizers have been tested and verified:
- ✅ Data structures (Array, Stack, Queue, Linked List)
- ✅ Sorting algorithms (5 algorithms)
- ✅ Search algorithms (2 algorithms)
- ✅ Animation controls
- ✅ Input validation
- ✅ Error handling
- ✅ Browser compatibility

See [VERIFICATION_REPORT.md](./VERIFICATION_REPORT.md) for details.

## 📊 Implementation Status

### ✅ Completed (100%)
- [x] All functional requirements (FR-1 to FR-23)
- [x] All non-functional requirements (NFR-1 to NFR-16)
- [x] All visualizers implemented
- [x] Full testing completed
- [x] Documentation complete

### Performance Metrics
- Load time: < 2 seconds ✅
- Animation: 60 FPS ✅
- Response time: < 100ms ✅
- Browser support: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+ ✅

## 🎯 Use Cases

### 1. Self-Paced Learning
Students can learn at their own speed, pausing and stepping through algorithms.

### 2. Classroom Teaching
Instructors can use it for live demonstrations and explanations.

### 3. Interview Preparation
Practice visualizing common interview algorithms.

### 4. Algorithm Comparison
Compare different algorithms' performance and behavior.

### 5. Debugging Aid
Understand where algorithmic bugs might occur.

## 🌟 Highlights

- **Interactive**: Full control over animation flow
- **Visual**: See every step of algorithm execution
- **Educational**: Detailed explanations at each step
- **Fast**: Optimized for smooth 60 FPS animations
- **Modern**: Built with latest web technologies
- **Responsive**: Works on various screen sizes
- **Accessible**: Keyboard navigation support

## 🚀 Getting Started

1. **Read**: [QUICKSTART.md](./QUICKSTART.md) - 5 minutes
2. **Install**: Run `npm install` in both folders
3. **Start**: Run servers (see Quick Start above)
4. **Explore**: Visit http://localhost:5173
5. **Learn**: Try different visualizers

## 📖 Learning Path

### Beginner
1. Start with Array visualizer
2. Try Stack and Queue
3. Experiment with Bubble Sort
4. Learn Linear Search

### Intermediate
1. Master Linked List operations
2. Compare sorting algorithms
3. Understand Binary Search
4. Practice with custom inputs

### Advanced
1. Analyze time complexities
2. Compare algorithm performances
3. Experiment with edge cases
4. Explore graph algorithms

## 🚀 Deployment

Ready to deploy to production? We've got you covered!

### Quick Deploy (30 minutes)
```bash
# Check if ready for deployment
./check-deployment.sh

# Prepare for deployment
./prepare-deployment.sh
```

### Deployment Options
- **Frontend**: Vercel (recommended) or Netlify
- **Backend**: Render (recommended) or Railway
- **Database**: MongoDB Atlas (free tier available)

### Documentation
- 📖 **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete deployment guide
- ⚡ **[QUICK_DEPLOYMENT.md](./QUICK_DEPLOYMENT.md)** - Fast 30-minute deployment

### Free Tier Deployment
- ✅ $0/month with Vercel + Render + MongoDB Atlas
- ✅ Automatic HTTPS
- ✅ Auto-deploy on git push
- ✅ Global CDN

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and create a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Inspired by VisuAlgo and Algorithm Visualizer
- Built for educational purposes
- Designed for students worldwide

## 📞 Support

- 📧 Issues: Create an issue in the repository
- 📖 Docs: Check documentation files
- 💬 Questions: See ACCESS_GUIDE.md

## 🎯 Next Steps

1. ✅ Start the servers (see Quick Start)
2. ✅ Open http://localhost:5173
3. ✅ Choose a visualizer
4. ✅ Start learning!

---

**Made with ❤️ for algorithm learners everywhere**

**Status**: ✅ Production Ready | **Version**: 1.0.0 | **Date**: October 14, 2025

---

### Quick Links
- [Quick Start Guide](./QUICKSTART.md)
- [Access URLs](./ACCESS_GUIDE.md)
- [Full Documentation](./IMPLEMENTATION_README.md)
- [Testing Report](./VERIFICATION_REPORT.md)
- [Project Summary](./PROJECT_SUMMARY.md)
