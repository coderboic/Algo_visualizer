# 🚀 Quick Start Guide - AlgoBook

## Getting Started in 5 Minutes

### Step 1: Open Two Terminals

#### Terminal 1 - Backend Server
```bash
cd /home/rishabh/Desktop/projects/Algo_visualizer/backend
npm run dev
```
✅ Backend running on: http://localhost:5000

#### Terminal 2 - Frontend Server
```bash
cd /home/rishabh/Desktop/projects/Algo_visualizer/frontend
npm run dev
```
✅ Frontend running on: http://localhost:5173

### Step 2: Open Browser
Navigate to: **http://localhost:5173**

## 🎯 What to Try First

### 1. Data Structures (Easiest to Start)

#### Array Visualizer
```
http://localhost:5173/visualizer/array
```
- Click "Insert at End" to add elements
- Enter a number and click "Search"
- Use playback controls to see step-by-step

#### Stack Visualizer
```
http://localhost:5173/visualizer/stack
```
- Enter a number and click "Push"
- Click "Pop" to remove from top
- Try "Peek" to view without removing
- Watch LIFO principle in action

#### Queue Visualizer
```
http://localhost:5173/visualizer/queue
```
- Enter a number and click "Enqueue"
- Click "Dequeue" to remove from front
- Observe FIFO principle

#### Linked List Visualizer
```
http://localhost:5173/visualizer/linked-list
```
- Insert at head or tail
- Click "Traverse" to walk through list
- Watch pointer animations

### 2. Sorting Algorithms

#### Bubble Sort (Simplest)
```
http://localhost:5173/visualizer/bubble-sort
```
1. Click "Generate Random Array"
2. Adjust speed if needed (try 2x)
3. Click Play ▶️
4. Watch comparisons and swaps

#### Quick Sort (Most Interesting)
```
http://localhost:5173/visualizer/quick-sort
```
1. Generate array
2. Watch pivot selection
3. See partitioning in action

### 3. Search Algorithms

#### Searching Visualizer
```
http://localhost:5173/visualizer/searching
```
1. Choose "Linear Search" or "Binary Search"
2. Enter a target value
3. Click "Start Search"
4. Compare both algorithms

## 🎮 Essential Controls

### Animation Controls (Available on all visualizers)
- ▶️ **Play**: Start automatic animation
- ⏸️ **Pause**: Stop at current step
- ⏮️ **Step Back**: Go to previous step
- ⏭️ **Step Forward**: Go to next step
- 🔄 **Reset**: Return to beginning
- 🎚️ **Speed**: Choose 0.5x, 1x, 2x, or 4x

### Tips for Best Experience
1. Start with **slower speed** (0.5x or 1x) to understand
2. Use **step controls** to examine each operation
3. Read the **description box** at each step
4. Try **custom input** for specific scenarios
5. Compare **complexity information** at bottom

## 📚 Navigation

### Homepage
```
http://localhost:5173/
```
- View all categories
- Quick links to popular algorithms
- Feature highlights

### Browse All Algorithms
```
http://localhost:5173/algorithms
```
- Filter by category
- Search algorithms
- View complexity information

### Categories
- Data Structures: `/algorithms/data-structures`
- Sorting: `/algorithms/sorting`
- Searching: `/algorithms/searching`
- Graph: `/algorithms/graph`

## 🎓 Learning Path

### Beginner (Day 1)
1. ✅ Array operations (10 min)
2. ✅ Stack operations (10 min)
3. ✅ Queue operations (10 min)
4. ✅ Bubble Sort (15 min)
5. ✅ Linear Search (10 min)

### Intermediate (Day 2)
1. ✅ Linked List operations (15 min)
2. ✅ Selection Sort (10 min)
3. ✅ Insertion Sort (10 min)
4. ✅ Binary Search (15 min)

### Advanced (Day 3+)
1. ✅ Merge Sort (20 min)
2. ✅ Quick Sort (20 min)
3. ✅ Graph algorithms (if implemented)

## 🔧 Troubleshooting

### "Cannot GET /"
➡️ Make sure frontend server is running on port 5173

### "Network Error"
➡️ Make sure backend server is running on port 5000

### "Port already in use"
➡️ Kill the process: `lsof -i :5000` or `lsof -i :5173`

### Visualizer not loading
➡️ Check browser console (F12) for errors
➡️ Refresh the page (Ctrl+R or Cmd+R)

### Slow animations
➡️ Reduce array size using the slider
➡️ Increase speed using speed control

## 📱 Keyboard Shortcuts

- **Space**: Play/Pause
- **→**: Step Forward
- **←**: Step Backward
- **R**: Reset
- **1-4**: Speed selection

## 🎯 Quick Examples

### Example 1: Visualize Bubble Sort
```
1. Go to http://localhost:5173/visualizer/bubble-sort
2. Click "Shuffle" for random array
3. Set speed to 1x
4. Click Play ▶️
5. Watch the bubbling effect!
```

### Example 2: Stack Overflow/Underflow
```
1. Go to http://localhost:5173/visualizer/stack
2. Push 10 elements (until full)
3. Try pushing one more (overflow!)
4. Pop all elements
5. Try popping again (underflow!)
```

### Example 3: Compare Search Algorithms
```
1. Go to http://localhost:5173/visualizer/searching
2. Generate sorted array
3. Run Linear Search with target = 45
4. Note the steps taken
5. Reset and run Binary Search with same target
6. Compare step counts!
```

## 📊 Understanding the Interface

### Color Coding
- 🟦 **Blue**: Normal element
- 🟩 **Green**: Found/Sorted element
- 🟥 **Red**: Being compared
- 🟧 **Orange**: Current/Mid element
- 🟨 **Yellow**: In range/Active

### Information Boxes
- **Blue Box**: Current step description
- **Yellow Box**: Complexity information
- **Green Box**: Success message
- **Red Box**: Error/Warning

## 🎨 Customization

### Array Size
- Use slider to adjust (5-100 elements)
- Smaller = Faster visualization
- Larger = More detail

### Speed Control
- **0.5x**: Detailed learning (2000ms per step)
- **1x**: Normal pace (1000ms per step)
- **2x**: Quick review (500ms per step)
- **4x**: Fast overview (250ms per step)

### Custom Input
- Enter numbers separated by commas
- Example: `5, 12, 8, 20, 3`
- Press Enter or click button

## 📖 Documentation

### Full Documentation
- `IMPLEMENTATION_README.md` - Complete setup guide
- `VERIFICATION_REPORT.md` - Testing details
- `SRS.md` - Requirements specification

### API Documentation
- Backend API: http://localhost:5000/health
- Swagger docs (if configured): http://localhost:5000/api-docs

## 🆘 Support

### Common Questions

**Q: How do I reset everything?**
A: Click the reset button (🔄) in the control panel

**Q: Can I use my own data?**
A: Yes! Use the custom input field to enter your values

**Q: Why is binary search not working?**
A: Binary search requires a sorted array. Click "Sorted Array" button first.

**Q: How do I make it faster/slower?**
A: Use the speed dropdown in the control panel

**Q: Can I compare algorithms?**
A: Open multiple tabs to compare side-by-side

## ✨ Pro Tips

1. **Use Step Controls**: Master the step-by-step controls for deep understanding
2. **Read Descriptions**: Each step has an explanation - read them!
3. **Try Edge Cases**: Test with empty arrays, single elements, sorted arrays
4. **Compare Speeds**: Try the same input on different algorithms
5. **Watch Complexities**: Notice how algorithm speed matches Big O notation
6. **Use Dark Mode**: Toggle in header for comfortable viewing
7. **Experiment**: Try to break things - it's the best way to learn!

## 🎉 You're Ready!

Open http://localhost:5173 and start visualizing algorithms!

**Happy Learning! 🚀📚**

---

For more help, check:
- Full README: `IMPLEMENTATION_README.md`
- Testing Guide: `VERIFICATION_REPORT.md`
- Original Requirements: See SRS document
