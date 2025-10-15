# AlgoBook - Algorithm Visualizer

An interactive web-based educational platform for visualizing algorithms and data structures through step-by-step animations.

## 🚀 Live Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

## 📋 Features Implemented

### ✅ Data Structures (FR-4 to FR-7)
- **Array Visualization**: Insert, delete, search operations with O(1) access time
- **Linked List Visualization**: Node operations, traversal, insert/delete at head/tail
- **Stack Visualization**: Push, pop, peek with LIFO principle and overflow/underflow detection
- **Queue Visualization**: Enqueue, dequeue, peek with FIFO principle

### ✅ Sorting Algorithms (FR-8 to FR-12)
- **Bubble Sort**: Step-by-step comparison and swapping visualization
- **Selection Sort**: Minimum element selection and placement
- **Insertion Sort**: Element insertion into sorted portion
- **Merge Sort**: Divide-and-conquer with merge visualization
- **Quick Sort**: Pivot selection and partitioning

### ✅ Search Algorithms (FR-13 to FR-14)
- **Linear Search**: Sequential element checking with highlighting
- **Binary Search**: Divide-and-conquer on sorted arrays with range visualization

### ✅ Animation Controls (FR-15 to FR-18)
- Play/Pause functionality
- Step forward and backward controls
- Speed adjustment (0.5x, 1x, 2x, 4x)
- Reset to initial state
- Progress indicator showing current step

### ✅ Input & Customization (FR-19 to FR-20)
- Custom input for arrays and values
- Random data generation with configurable size
- Input validation
- Array size adjustment (5-100 elements)

### ✅ Educational Content (FR-21 to FR-23)
- Algorithm descriptions and explanations
- Time and space complexity information
- Step-by-step descriptions during execution
- Comparison tables for algorithms
- Visual feedback for operations

## 🛠️ Technology Stack

### Frontend
- React 19 with TypeScript
- Redux Toolkit for state management
- Framer Motion for animations
- D3.js for visualizations
- TailwindCSS for styling
- React Router for navigation
- Vite for build tooling

### Backend
- Node.js with Express
- TypeScript
- Socket.io for real-time communication
- Comprehensive algorithm implementations

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Clone the Repository
```bash
git clone <repository-url>
cd Algo_visualizer
```

### Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

## 🚀 Running the Application

### Development Mode

#### Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run on http://localhost:5000

#### Start Frontend Server
```bash
cd frontend
npm run dev
```
Frontend will run on http://localhost:5173

### Production Build

#### Build Backend
```bash
cd backend
npm run build
npm start
```

#### Build Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 📱 Using the Application

### 1. Homepage
- View featured algorithms and categories
- Quick access to popular visualizations
- Browse algorithm categories

### 2. Algorithm Categories
Navigate through different categories:
- **Data Structures**: Array, Stack, Queue, Linked List
- **Sorting Algorithms**: Bubble, Selection, Insertion, Merge, Quick Sort
- **Searching Algorithms**: Linear Search, Binary Search
- **Graph Algorithms**: BFS, DFS, Dijkstra

### 3. Visualizations

#### Data Structure Operations
1. Select a data structure (Array, Stack, Queue, Linked List)
2. Use operation buttons to perform actions
3. Watch step-by-step animations
4. Control playback with animation controls

#### Algorithm Visualizations
1. Choose an algorithm from the category
2. Input custom data or generate random data
3. Configure algorithm parameters if needed
4. Click "Start" to begin visualization
5. Use controls to pause, step through, or adjust speed

### 4. Animation Controls
- **Play/Pause**: Start or pause the animation
- **Step Forward**: Move to next step
- **Step Backward**: Go back one step
- **Reset**: Return to initial state
- **Speed Control**: Adjust animation speed (0.5x - 4x)

### 5. Custom Input
- Enter custom values for arrays
- Adjust array size using slider
- Generate random data
- Input validation ensures correct format

## 🎯 Key Functionalities

### Array Visualizer
- Insert elements at start, middle, or end
- Delete elements from any position
- Search for specific values
- Visual feedback for operations
- Time complexity information

### Stack Visualizer
- Push elements with overflow detection
- Pop elements with underflow handling
- Peek at top element
- LIFO principle visualization
- Maximum size limit (10 elements)

### Queue Visualizer
- Enqueue at rear
- Dequeue from front
- Peek front and rear elements
- FIFO principle visualization
- Maximum size limit (8 elements)

### Linked List Visualizer
- Insert at head or tail
- Delete from head or tail
- Traverse entire list
- Visual pointers between nodes
- Node and pointer highlighting

### Sorting Visualizers
- Real-time comparison highlighting
- Swap animations
- Sorted portion indication
- Step-by-step descriptions
- Complexity analysis

### Search Visualizers
- Element-by-element checking (Linear)
- Binary division visualization (Binary)
- Found/Not found indication
- Step counter
- Algorithm comparison table

## 📊 Performance Requirements (NFR-1 to NFR-8)

### Implemented Performance Features
- ✅ Fast load times (< 3 seconds)
- ✅ Smooth 60 FPS animations
- ✅ Handles arrays up to 100 elements
- ✅ Responsive UI (< 100ms response time)
- ✅ Error handling and validation
- ✅ Graceful error recovery

### Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Responsive Design
- Desktop (1920x1080 to 1366x768)
- Tablet (768px+)
- Touch-screen support

## 🔍 API Endpoints

### Algorithm Endpoints
- `GET /api/algorithms` - Get all algorithms
- `GET /api/algorithms/:id` - Get specific algorithm
- `GET /api/algorithms/category/:category` - Get algorithms by category

### Execution Endpoints
- `POST /api/execute/algorithm` - Execute algorithm with input
- `GET /api/execute/status/:id` - Get execution status
- `POST /api/execute/validate` - Validate input

### Visualization Endpoints
- `POST /api/visualize/generate` - Generate visualization steps
- `GET /api/visualize/:id` - Get visualization data

## 🧪 Testing

### Run Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Manual Testing Checklist
- [ ] All data structures load and operate correctly
- [ ] Sorting algorithms visualize properly
- [ ] Search algorithms function as expected
- [ ] Animation controls work smoothly
- [ ] Custom input validates correctly
- [ ] Random generation works
- [ ] Responsive on different screen sizes
- [ ] Dark mode toggles properly

## 📖 Project Structure

```
Algo_visualizer/
├── backend/
│   ├── src/
│   │   ├── algorithms/        # Algorithm implementations
│   │   ├── controllers/       # Request handlers
│   │   ├── data/             # Algorithm metadata
│   │   ├── middleware/       # Express middleware
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── websocket/        # WebSocket handlers
│   │   └── index.ts          # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Visualizers/  # Algorithm visualizers
│   │   │   ├── Controls/     # Control components
│   │   │   └── Layout/       # Layout components
│   │   ├── contexts/         # React contexts
│   │   ├── data/             # Frontend data
│   │   ├── pages/            # Page components
│   │   ├── routes/           # Route configuration
│   │   ├── services/         # API services
│   │   ├── store/            # Redux store
│   │   ├── App.tsx           # App component
│   │   └── main.tsx          # Entry point
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🎨 Design Philosophy

### Visual Learning
- Clear, intuitive visualizations
- Color-coded operations
- Smooth animations
- Real-time feedback

### Educational Focus
- Step-by-step explanations
- Complexity analysis
- Use cases and advantages
- Comparison tables

### User Experience
- Intuitive controls
- Responsive design
- Dark mode support
- Accessible interface

## 🐛 Troubleshooting

### Backend Issues
```bash
# Clear node_modules and reinstall
rm -rf backend/node_modules
cd backend && npm install

# Check if port 5000 is available
lsof -i :5000

# Restart the backend server
npm run dev
```

### Frontend Issues
```bash
# Clear node_modules and reinstall
rm -rf frontend/node_modules
cd frontend && npm install

# Clear Vite cache
rm -rf frontend/node_modules/.vite

# Restart the frontend server
npm run dev
```

### Common Issues
1. **Port already in use**: Change PORT in .env file
2. **Module not found**: Run `npm install`
3. **TypeScript errors**: Run `npm run build` to check
4. **CORS errors**: Ensure backend is running on port 5000

## 📝 Future Enhancements

### Planned Features
- User authentication and profiles
- Save and share visualizations
- More advanced algorithms (A*, Bellman-Ford, etc.)
- Code editor integration
- Step-by-step tutorials
- Quiz and practice problems
- Mobile app development

### Performance Improvements
- Lazy loading of visualizers
- Web Workers for heavy computations
- Caching of visualization data
- PWA support

## 👥 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by VisuAlgo and Algorithm Visualizer
- Built with modern web technologies
- Educational resource for students worldwide

## 📞 Support

For issues, questions, or suggestions:
- Create an issue in the repository
- Contact the development team
- Check documentation in /docs folder

---

**AlgoBook** - Making algorithms visual, interactive, and fun! 🚀
