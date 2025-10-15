# 🎓 How to Test the New Learn Feature

## ✅ Quick Test Steps

### 1. **Start the Application**

**Frontend** (already running):
```bash
# Running on http://localhost:5174/
```

**Backend**:
```bash
cd backend
npm start
# Should run on http://localhost:5000/
```

### 2. **Access the Learn Feature**

#### Option A: From Algorithms Page
1. Open browser: `http://localhost:5174/`
2. Click **"Browse Algorithms"** or navigate to `/algorithms`
3. Find any algorithm card (e.g., "Bubble Sort")
4. Click the **"Learn"** button (book icon)
5. You'll be redirected to `/algorithm/bubble-sort`

#### Option B: Direct URL
- Bubble Sort: `http://localhost:5174/learn/bubble-sort`
- Binary Search: `http://localhost:5174/learn/binary-search`
- Quick Sort: `http://localhost:5174/learn/quick-sort`
- Dijkstra: `http://localhost:5174/learn/dijkstra`
- Stack: `http://localhost:5174/learn/stack`
- Any algorithm: `http://localhost:5174/learn/{algorithm-id}`

### 3. **What You Should See**

✅ **Beautiful Learn Page with:**

1. **Header Section**
   - Algorithm name in large, bold text
   - Description
   - Category badge (colored)
   - "Back" and "Visualize" buttons

2. **Complexity Cards** (2 cards side-by-side)
   - Time Complexity (with Best/Average/Worst cases)
   - Space Complexity (with stability info for sorts)

3. **How It Works Section**
   - Detailed explanation
   - Step-by-step breakdown
   - Clear formatting

4. **Pros & Cons** (2 cards side-by-side)
   - Advantages with green checkmarks
   - Disadvantages with red X marks

5. **Use Cases Section**
   - Real-world applications
   - When to use this algorithm

6. **Code Implementation Section**
   - Language tabs (JavaScript, Python, C++, Java)
   - Syntax-highlighted code
   - Dark code editor theme

7. **Dry Run Example** (if available)
   - Input display
   - Step-by-step execution
   - Array state at each step
   - Descriptive text

### 4. **Test Different Algorithms**

Try these to see different content:

| Algorithm | What to Check |
|-----------|---------------|
| **Bubble Sort** | Has dry run example with 5 steps |
| **Quick Sort** | Multiple language implementations |
| **Binary Search** | Simple, clear dry run |
| **Stack** | Data structure with LIFO explanation |
| **Dijkstra** | Graph algorithm with complex explanation |
| **Merge Sort** | Divide-and-conquer explanation |

### 5. **Test Interactions**

- [ ] Click "Back" button → Should go back to previous page
- [ ] Click "Visualize" button → Should open visualizer for that algorithm
- [ ] Switch between code languages → Should update code block
- [ ] Scroll through page → Smooth scrolling
- [ ] Test dark mode → All text should be readable
- [ ] Test on mobile → Responsive layout

### 6. **Expected Behavior**

✅ **Success Indicators:**
- Page loads without errors
- All sections display properly
- Code blocks are formatted nicely
- Colors are appropriate (blue, purple, green, red, yellow)
- Icons appear correctly
- Dark mode works
- Navigation buttons work

❌ **Error Indicators:**
- 404 Not Found
- Blank page
- Missing sections
- Broken styling
- Console errors

## 🐛 Troubleshooting

### Issue: Page shows "Algorithm Not Found"
**Solution:** Check the algorithm ID in the URL matches one from the list:
- `bubble-sort`, `quick-sort`, `merge-sort`, `insertion-sort`, `selection-sort`
- `linear-search`, `binary-search`
- `array`, `linked-list`, `stack`, `queue`
- `bfs`, `dfs`, `dijkstra`

### Issue: Some sections are missing
**Solution:** Some algorithms may not have all sections (like dry run). This is normal.

### Issue: Code doesn't show
**Solution:** Make sure you're viewing an algorithm that has code (sorting/searching algorithms).

### Issue: Styling looks broken
**Solution:** 
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check console for errors

## 📸 Screenshot Points

Take screenshots of:
1. Full Learn page for Bubble Sort (shows all features)
2. Code section with language tabs
3. Dry run section with steps
4. Advantages/Disadvantages cards
5. Mobile responsive view

## ✅ Final Checklist

- [ ] Frontend running on port 5174
- [ ] Can access `/algorithms` page
- [ ] "Learn" button visible on algorithm cards
- [ ] Clicking "Learn" opens documentation page
- [ ] All sections load properly
- [ ] Code syntax highlighting works
- [ ] Language switcher works
- [ ] "Visualize" button redirects correctly
- [ ] Dark mode supported
- [ ] No console errors
- [ ] Responsive on mobile

---

**Happy Testing! 🎉**

If everything works, you now have a comprehensive algorithm learning platform!
