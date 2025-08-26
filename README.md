# Algorithm Visualizer

A comprehensive platform for visualizing algorithms, data structures, and learning computer science concepts through interactive animations.

## Features

- **Interactive Visualizations**: Watch algorithms come to life with step-by-step animations
- **Multiple Algorithm Categories**: Sorting, Searching, Graph, Tree, Dynamic Programming
- **Code Playground**: Write, test, and visualize your own algorithm implementations
- **Customizable Parameters**: Change inputs, speeds, and see how algorithms perform
- **Tutorial System**: Learn with interactive guides and explanations
- **Real-time Collaboration**: Code together with WebSocket integration

## Technology Stack

### Frontend
- React 18+ with TypeScript
- Tailwind CSS for styling
- Redux Toolkit & Zustand for state management
- Monaco Editor for code editing
- D3.js and Framer Motion for visualizations
- React Flow for graph visualizations

### Backend
- Node.js with Express
- TypeScript
- WebSockets with Socket.IO
- In-memory algorithm execution

## Getting Started

### Prerequisites
- Node.js 20+ installed
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/algo-visualizer.git
cd algo-visualizer
```

2. Run the setup script
```bash
chmod +x setup.sh
./setup.sh
```

3. Start the backend server
```bash
cd backend
npm run dev
```

4. In a new terminal, start the frontend
```bash
cd frontend
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Available Algorithms

### Sorting
- Bubble Sort
- Quick Sort
- Merge Sort
- Heap Sort
- Insertion Sort
- Selection Sort

### Searching
- Binary Search
- Linear Search
- Jump Search

### Graph Algorithms
- Breadth-First Search (BFS)
- Depth-First Search (DFS)
- Dijkstra's Algorithm
- Bellman-Ford Algorithm
- Kruskal's Algorithm
- Prim's Algorithm

### Tree Algorithms
- Binary Search Tree Operations
- Tree Traversals
- AVL Tree Operations

### Dynamic Programming
- Fibonacci Sequence
- 0/1 Knapsack Problem
- Longest Common Subsequence
- Edit Distance

## Project Structure

```
algo_visualizer/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── services/       # API services
│   │   ├── contexts/       # React contexts
│   │   ├── store/          # Redux store and slices
│   │   └── routes/         # Application routes
├── backend/                # Node.js backend
│   ├── src/
│   │   ├── algorithms/     # Algorithm implementations
│   │   ├── controllers/    # API controllers
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── websocket/      # WebSocket functionality
│   │   └── data/           # Static data
└── README.md
```

## Development Roadmap

- [x] Project setup and core architecture
- [x] Basic algorithm visualizations
- [x] Code playground implementation
- [x] WebSocket integration for real-time collaboration
- [ ] User authentication and profiles
- [ ] Saving and sharing visualizations
- [ ] Additional algorithm categories
- [ ] Mobile responsiveness
- [ ] Dark mode
- [ ] Internationalization support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- All open-source libraries used in this project
- Algorithm visualization inspiration from various educational resources
