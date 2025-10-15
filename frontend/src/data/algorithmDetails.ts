export const algorithmDetails = {
  'bubble-sort': {
    explanation: `
Bubble Sort is one of the simplest sorting algorithms. It works by repeatedly stepping through the list, 
comparing adjacent elements and swapping them if they are in wrong order. This pass is repeated until no swaps are needed.

**How it works:**
1. Compare adjacent elements
2. Swap if they're in wrong order
3. Repeat until array is sorted
4. Largest elements "bubble" to the end
    `,
    dryRun: {
      input: [64, 34, 25, 12, 22, 11, 90],
      steps: [
        { pass: 1, array: [34, 25, 12, 22, 11, 64, 90], description: 'First pass complete, 90 and 64 in position' },
        { pass: 2, array: [25, 12, 22, 11, 34, 64, 90], description: 'Second pass, 34 in position' },
        { pass: 3, array: [12, 22, 11, 25, 34, 64, 90], description: 'Third pass, 25 in position' },
        { pass: 4, array: [12, 11, 22, 25, 34, 64, 90], description: 'Fourth pass, 22 in position' },
        { pass: 5, array: [11, 12, 22, 25, 34, 64, 90], description: 'Fifth pass, array sorted!' }
      ]
    },
    code: {
      javascript: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break; // Optimization
  }
  return arr;
}`,
      python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`,
      cpp: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`
    },
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    stable: true,
    advantages: [
      'Simple to understand and implement',
      'No additional memory required (in-place)',
      'Stable sorting algorithm',
      'Adaptive - efficient for nearly sorted data'
    ],
    disadvantages: [
      'Very inefficient for large datasets',
      'Poor average and worst-case time complexity',
      'Many unnecessary comparisons'
    ],
    useCases: [
      'Educational purposes',
      'Small datasets (< 50 elements)',
      'Nearly sorted data',
      'When simplicity is more important than efficiency'
    ]
  },

  'quick-sort': {
    explanation: `
Quick Sort is an efficient divide-and-conquer sorting algorithm. It works by selecting a 'pivot' element 
and partitioning the array around it so that smaller elements go before and larger elements go after.

**How it works:**
1. Pick a pivot element
2. Partition: rearrange array so smaller elements come before pivot, larger after
3. Recursively apply above steps to sub-arrays
    `,
    dryRun: {
      input: [10, 80, 30, 90, 40, 50, 70],
      steps: [
        { step: 'Initial', array: [10, 80, 30, 90, 40, 50, 70], pivot: 70, description: 'Choose pivot (70)' },
        { step: 'Partition', array: [10, 30, 40, 50, 70, 90, 80], description: 'Partition around 70' },
        { step: 'Left sub', array: [10, 30, 40, 50, 70, 90, 80], pivot: 50, description: 'Sort left: pivot 50' },
        { step: 'Right sub', array: [10, 30, 40, 50, 70, 80, 90], pivot: 90, description: 'Sort right: pivot 90' },
        { step: 'Complete', array: [10, 30, 40, 50, 70, 80, 90], description: 'Sorted!' }
      ]
    },
    code: {
      javascript: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
      python: `def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`
    },
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(log n)',
    stable: false,
    advantages: [
      'Very efficient for large datasets',
      'In-place sorting',
      'Cache-friendly',
      'Widely used in practice'
    ],
    disadvantages: [
      'Unstable sort',
      'Worst case O(n²) with poor pivot selection',
      'Recursive overhead'
    ],
    useCases: [
      'General purpose sorting',
      'Large datasets',
      'When average-case performance matters',
      'Systems with good cache'
    ]
  },

  'binary-search': {
    explanation: `
Binary Search is an efficient algorithm for finding an item in a sorted array. It works by repeatedly dividing 
the search interval in half.

**How it works:**
1. Compare target with middle element
2. If equal, found!
3. If target is smaller, search left half
4. If target is larger, search right half
5. Repeat until found or interval is empty
    `,
    dryRun: {
      input: { array: [2, 5, 8, 12, 16, 23, 38, 45, 56, 67, 78], target: 23 },
      steps: [
        { step: 1, left: 0, right: 10, mid: 5, value: 23, description: 'Check middle (index 5): 23 == 23, Found!' },
      ]
    },
    code: {
      javascript: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1; // Not found
}`,
      python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1  # Not found`
    },
    timeComplexity: {
      best: 'O(1)',
      average: 'O(log n)',
      worst: 'O(log n)'
    },
    spaceComplexity: 'O(1)',
    prerequisites: ['Array must be sorted'],
    advantages: [
      'Very fast for large datasets',
      'Logarithmic time complexity',
      'Minimal memory usage'
    ],
    disadvantages: [
      'Requires sorted array',
      'Not efficient for small arrays',
      'Requires random access'
    ],
    useCases: [
      'Searching in sorted databases',
      'Dictionary lookups',
      'Finding boundaries',
      'Optimization problems'
    ]
  },

  'dijkstra': {
    explanation: `
Dijkstra's algorithm finds the shortest path between nodes in a weighted graph. It maintains a set of visited 
nodes and continuously selects the unvisited node with the smallest distance.

**How it works:**
1. Set distance to start node as 0, all others as infinity
2. Mark all nodes as unvisited
3. Select unvisited node with smallest distance
4. Update distances to all neighbors
5. Mark current node as visited
6. Repeat until all nodes visited or destination reached
    `,
    code: {
      javascript: `function dijkstra(graph, start) {
  const distances = {};
  const visited = new Set();
  const pq = new PriorityQueue();
  
  // Initialize distances
  for (let node in graph) {
    distances[node] = node === start ? 0 : Infinity;
  }
  
  pq.enqueue(start, 0);
  
  while (!pq.isEmpty()) {
    const current = pq.dequeue();
    
    if (visited.has(current)) continue;
    visited.add(current);
    
    for (let neighbor in graph[current]) {
      const distance = distances[current] + graph[current][neighbor];
      
      if (distance < distances[neighbor]) {
        distances[neighbor] = distance;
        pq.enqueue(neighbor, distance);
      }
    }
  }
  
  return distances;
}`
    },
    timeComplexity: {
      best: 'O((V + E) log V)',
      average: 'O((V + E) log V)',
      worst: 'O((V + E) log V)'
    },
    spaceComplexity: 'O(V)',
    advantages: [
      'Finds optimal shortest path',
      'Works for weighted graphs',
      'Widely used and well-understood'
    ],
    disadvantages: [
      'Cannot handle negative edge weights',
      'May be slower than A* with good heuristic',
      'Visits many unnecessary nodes'
    ],
    useCases: [
      'GPS navigation',
      'Network routing protocols',
      'Social network analysis',
      'Resource allocation'
    ]
  },

  'knapsack': {
    explanation: `
The 0/1 Knapsack problem is about selecting items with maximum total value that fit in a knapsack of limited capacity.
Each item can be taken (1) or not taken (0).

**How it works (Dynamic Programming):**
1. Create a 2D table dp[i][w]
2. dp[i][w] = maximum value using first i items with capacity w
3. For each item, decide: include or exclude
4. Take maximum of both choices
5. Final answer is dp[n][capacity]
    `,
    code: {
      javascript: `function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array(n + 1).fill(0)
    .map(() => Array(capacity + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          values[i - 1] + dp[i - 1][w - weights[i - 1]],
          dp[i - 1][w]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  
  return dp[n][capacity];
}`
    },
    timeComplexity: {
      best: 'O(nW)',
      average: 'O(nW)',
      worst: 'O(nW)'
    },
    spaceComplexity: 'O(nW)',
    advantages: [
      'Finds optimal solution',
      'Can be space-optimized',
      'Classic DP problem'
    ],
    disadvantages: [
      'Pseudo-polynomial time',
      'High memory for large capacity',
      'Only works for integer weights'
    ],
    useCases: [
      'Resource allocation',
      'Budget optimization',
      'Portfolio selection',
      'Cargo loading'
    ]
  },

  'kmp': {
    explanation: `
The Knuth-Morris-Pratt (KMP) algorithm is an efficient pattern matching algorithm that avoids redundant comparisons 
by using information from previous matches.

**How it works:**
1. Preprocess pattern to build LPS (Longest Proper Prefix which is also Suffix) array
2. Use LPS to skip characters when mismatch occurs
3. Never move back in the text, only in the pattern
4. Linear time complexity guaranteed
    `,
    code: {
      javascript: `function kmpSearch(text, pattern) {
  const lps = computeLPS(pattern);
  const matches = [];
  let i = 0, j = 0;
  
  while (i < text.length) {
    if (text[i] === pattern[j]) {
      i++;
      j++;
    }
    
    if (j === pattern.length) {
      matches.push(i - j);
      j = lps[j - 1];
    } else if (i < text.length && text[i] !== pattern[j]) {
      if (j !== 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }
  
  return matches;
}

function computeLPS(pattern) {
  const lps = Array(pattern.length).fill(0);
  let len = 0, i = 1;
  
  while (i < pattern.length) {
    if (pattern[i] === pattern[len]) {
      lps[i++] = ++len;
    } else if (len !== 0) {
      len = lps[len - 1];
    } else {
      lps[i++] = 0;
    }
  }
  
  return lps;
}`
    },
    timeComplexity: {
      best: 'O(n + m)',
      average: 'O(n + m)',
      worst: 'O(n + m)'
    },
    spaceComplexity: 'O(m)',
    advantages: [
      'Linear time guaranteed',
      'No backtracking in text',
      'Efficient for large texts'
    ],
    disadvantages: [
      'Preprocessing overhead',
      'Complex to understand',
      'LPS array memory'
    ],
    useCases: [
      'Text editors',
      'Search engines',
      'DNA sequence matching',
      'Compiler design'
    ]
  },

  // Data Structures
  'array': {
    explanation: `
An Array is a fundamental data structure that stores elements in contiguous memory locations. Each element can be 
directly accessed using its index, making it one of the most efficient data structures for random access.

**Key Operations:**
1. **Access**: Get element at index - O(1)
2. **Insert**: Add element at end - O(1), at position - O(n)
3. **Delete**: Remove element - O(n)
4. **Search**: Find element - O(n) for unsorted, O(log n) for sorted
    `,
    timeComplexity: {
      best: 'O(1) access',
      average: 'O(n) search',
      worst: 'O(n) insert/delete'
    },
    spaceComplexity: 'O(n)',
    advantages: [
      'Constant time access by index',
      'Cache-friendly due to contiguous memory',
      'Simple and widely supported',
      'Efficient iteration'
    ],
    disadvantages: [
      'Fixed size (in static arrays)',
      'Expensive insertions and deletions',
      'Wasted space if not fully utilized'
    ],
    useCases: [
      'Storing and accessing sequential data',
      'Implementing other data structures',
      'Lookup tables',
      'Buffers and caches'
    ]
  },

  'linked-list': {
    explanation: `
A Linked List is a linear data structure where elements are stored in nodes. Each node contains data and a reference 
(link) to the next node. Unlike arrays, elements are not stored in contiguous memory locations.

**Types:**
1. **Singly Linked**: Each node points to next
2. **Doubly Linked**: Each node points to both next and previous
3. **Circular**: Last node points back to first

**Key Operations:**
- Insert at head: O(1)
- Insert at tail: O(n) singly, O(1) doubly
- Delete: O(1) with reference, O(n) by value
- Search: O(n)
    `,
    timeComplexity: {
      best: 'O(1) insert at head',
      average: 'O(n) search',
      worst: 'O(n) access'
    },
    spaceComplexity: 'O(n)',
    advantages: [
      'Dynamic size',
      'Efficient insertion and deletion at known positions',
      'No memory waste',
      'Easy to implement stacks and queues'
    ],
    disadvantages: [
      'No random access',
      'Extra memory for pointers',
      'Not cache-friendly',
      'Cannot do binary search'
    ],
    useCases: [
      'Implementing stacks and queues',
      'Undo functionality in applications',
      'Hash table chaining',
      'Graph adjacency lists'
    ]
  },

  'stack': {
    explanation: `
A Stack is a linear data structure that follows the Last-In-First-Out (LIFO) principle. The last element added 
is the first one to be removed.

**Key Operations:**
1. **Push**: Add element to top - O(1)
2. **Pop**: Remove element from top - O(1)
3. **Peek**: View top element without removing - O(1)
4. **isEmpty**: Check if stack is empty - O(1)

**Think of it like:** A stack of plates - you can only add or remove from the top!
    `,
    timeComplexity: {
      best: 'O(1)',
      average: 'O(1)',
      worst: 'O(1)'
    },
    spaceComplexity: 'O(n)',
    advantages: [
      'Simple and easy to implement',
      'All operations are O(1)',
      'Memory efficient',
      'Useful for many algorithms'
    ],
    disadvantages: [
      'Limited access (only top element)',
      'No random access',
      'Fixed size in array implementation',
      'Stack overflow possible'
    ],
    useCases: [
      'Function call management (call stack)',
      'Undo/Redo operations',
      'Expression evaluation',
      'Backtracking algorithms',
      'Browser history'
    ]
  },

  'queue': {
    explanation: `
A Queue is a linear data structure that follows the First-In-First-Out (FIFO) principle. The first element added 
is the first one to be removed.

**Key Operations:**
1. **Enqueue**: Add element to rear - O(1)
2. **Dequeue**: Remove element from front - O(1)
3. **Front**: View front element - O(1)
4. **isEmpty**: Check if queue is empty - O(1)

**Think of it like:** A line at a ticket counter - first person in line gets served first!
    `,
    timeComplexity: {
      best: 'O(1)',
      average: 'O(1)',
      worst: 'O(1)'
    },
    spaceComplexity: 'O(n)',
    advantages: [
      'Fair ordering (FIFO)',
      'All operations are O(1)',
      'Simple to implement',
      'Widely applicable'
    ],
    disadvantages: [
      'Limited access (only front and rear)',
      'No random access',
      'Can waste space in array implementation',
      'Queue overflow possible'
    ],
    useCases: [
      'Task scheduling',
      'Breadth-First Search',
      'Print queue management',
      'Request handling in servers',
      'Message queuing systems'
    ]
  },

  'linear-search': {
    explanation: `
Linear Search is the simplest search algorithm. It sequentially checks each element in the array until the target 
element is found or the end of the array is reached.

**How it works:**
1. Start from the first element
2. Compare each element with target
3. If match found, return index
4. If end reached without finding, return -1

**Best for:** Unsorted or small datasets
    `,
    code: {
      javascript: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i; // Found at index i
    }
  }
  return -1; // Not found
}`,
      python: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i  # Found at index i
    return -1  # Not found`,
      cpp: `int linearSearch(vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) {
            return i; // Found at index i
        }
    }
    return -1; // Not found
}`
    },
    timeComplexity: {
      best: 'O(1)',
      average: 'O(n)',
      worst: 'O(n)'
    },
    spaceComplexity: 'O(1)',
    advantages: [
      'Simple to implement',
      'Works on unsorted data',
      'No preprocessing required',
      'Works on any data structure'
    ],
    disadvantages: [
      'Slow for large datasets',
      'Inefficient compared to other methods',
      'Many unnecessary comparisons'
    ],
    useCases: [
      'Small datasets',
      'Unsorted data',
      'When simplicity is priority',
      'One-time searches'
    ]
  },

  'merge-sort': {
    explanation: `
Merge Sort is an efficient, stable, divide-and-conquer sorting algorithm. It divides the array into two halves, 
recursively sorts them, and then merges the sorted halves.

**How it works:**
1. **Divide**: Split array into two halves
2. **Conquer**: Recursively sort both halves
3. **Combine**: Merge the two sorted halves

**Key Feature:** Guaranteed O(n log n) performance
    `,
    code: {
      javascript: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return result.concat(left.slice(i), right.slice(j));
}`,
      python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result`
    },
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)'
    },
    spaceComplexity: 'O(n)',
    stable: true,
    advantages: [
      'Guaranteed O(n log n) performance',
      'Stable sorting algorithm',
      'Predictable performance',
      'Good for linked lists'
    ],
    disadvantages: [
      'Requires additional memory O(n)',
      'Slower than quicksort in practice',
      'Overkill for small arrays'
    ],
    useCases: [
      'External sorting (large files)',
      'Sorting linked lists',
      'When stable sort is required',
      'When worst-case performance matters'
    ]
  },

  'insertion-sort': {
    explanation: `
Insertion Sort builds the final sorted array one item at a time. It iterates through the array, and for each element, 
finds its correct position in the sorted portion and inserts it there.

**How it works:**
1. Start with second element (first is considered sorted)
2. Compare with elements in sorted portion
3. Shift larger elements one position right
4. Insert element in correct position
5. Repeat for all elements
    `,
    code: {
      javascript: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    
    arr[j + 1] = key;
  }
  return arr;
}`,
      python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        
        arr[j + 1] = key
    return arr`
    },
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    stable: true,
    advantages: [
      'Simple implementation',
      'Efficient for small data',
      'Adaptive - O(n) for nearly sorted',
      'Stable and in-place',
      'Online algorithm'
    ],
    disadvantages: [
      'Inefficient for large datasets',
      'O(n²) average and worst case',
      'Many comparisons and shifts'
    ],
    useCases: [
      'Small datasets (< 50 elements)',
      'Nearly sorted data',
      'Online sorting (data arrives over time)',
      'When simplicity matters'
    ]
  },

  'selection-sort': {
    explanation: `
Selection Sort divides the array into sorted and unsorted regions. It repeatedly selects the minimum element from 
the unsorted region and moves it to the end of the sorted region.

**How it works:**
1. Find minimum element in unsorted portion
2. Swap it with first unsorted element
3. Move boundary of sorted region one position right
4. Repeat until entire array is sorted
    `,
    code: {
      javascript: `function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;
    
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}`,
      python: `def selection_sort(arr):
    for i in range(len(arr) - 1):
        min_idx = i
        
        for j in range(i + 1, len(arr)):
            if arr[j] < arr[min_idx]:
                min_idx = j
        
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`
    },
    timeComplexity: {
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    stable: false,
    advantages: [
      'Simple to understand',
      'Minimal memory writes (good for flash/EEPROM)',
      'In-place sorting',
      'Performance independent of input'
    ],
    disadvantages: [
      'Always O(n²) - not adaptive',
      'Not stable',
      'Inefficient for large datasets'
    ],
    useCases: [
      'Small datasets',
      'When memory writes are expensive',
      'When simplicity is preferred',
      'Educational purposes'
    ]
  },

  'bfs': {
    explanation: `
Breadth-First Search (BFS) is a graph traversal algorithm that explores all vertices at the current depth before 
moving to vertices at the next depth level. It uses a queue data structure.

**How it works:**
1. Start at source node, mark as visited
2. Add to queue
3. While queue not empty:
   - Dequeue a vertex
   - Visit all unvisited neighbors
   - Mark neighbors as visited and enqueue them
4. Repeat until queue is empty
    `,
    code: {
      javascript: `function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  const result = [];
  
  visited.add(start);
  
  while (queue.length > 0) {
    const vertex = queue.shift();
    result.push(vertex);
    
    for (const neighbor of graph[vertex]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return result;
}`
    },
    timeComplexity: {
      best: 'O(V + E)',
      average: 'O(V + E)',
      worst: 'O(V + E)'
    },
    spaceComplexity: 'O(V)',
    advantages: [
      'Finds shortest path in unweighted graphs',
      'Complete - finds solution if exists',
      'Level-order traversal',
      'Good for finding nearby nodes'
    ],
    disadvantages: [
      'Memory intensive for wide graphs',
      'Not suitable for deep graphs',
      'Slower than DFS for some problems'
    ],
    useCases: [
      'Shortest path in unweighted graphs',
      'Social network connections',
      'Web crawling',
      'Network broadcasting',
      'GPS navigation'
    ]
  },

  'dfs': {
    explanation: `
Depth-First Search (DFS) is a graph traversal algorithm that explores as far as possible along each branch before 
backtracking. It can be implemented recursively or using a stack.

**How it works:**
1. Start at source node, mark as visited
2. Recursively visit an unvisited neighbor
3. Backtrack when no unvisited neighbors
4. Repeat until all reachable nodes are visited
    `,
    code: {
      javascript: `function dfs(graph, start, visited = new Set()) {
  visited.add(start);
  console.log(start);
  
  for (const neighbor of graph[start]) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
  
  return visited;
}

// Iterative version using stack
function dfsIterative(graph, start) {
  const visited = new Set();
  const stack = [start];
  
  while (stack.length > 0) {
    const vertex = stack.pop();
    
    if (!visited.has(vertex)) {
      visited.add(vertex);
      console.log(vertex);
      
      for (const neighbor of graph[vertex]) {
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
        }
      }
    }
  }
  
  return visited;
}`
    },
    timeComplexity: {
      best: 'O(V + E)',
      average: 'O(V + E)',
      worst: 'O(V + E)'
    },
    spaceComplexity: 'O(V)',
    advantages: [
      'Memory efficient for deep graphs',
      'Simple recursive implementation',
      'Finds path between nodes',
      'Good for topological sorting'
    ],
    disadvantages: [
      'May get stuck in infinite loops (cycles)',
      'Not optimal for shortest path',
      'Stack overflow risk in recursive version'
    ],
    useCases: [
      'Detecting cycles in graphs',
      'Path finding',
      'Topological sorting',
      'Solving puzzles (mazes, Sudoku)',
      'Finding connected components'
    ]
  }
};

export const getAlgorithmDetail = (algorithmId: string) => {
  return algorithmDetails[algorithmId as keyof typeof algorithmDetails] || null;
};
