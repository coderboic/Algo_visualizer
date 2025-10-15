import { sortingAlgorithms } from '../algorithms/sorting.comprehensive';
import { searchingAlgorithms } from '../algorithms/searching.comprehensive';
import { GraphAlgorithms } from '../algorithms/graph.comprehensive';
import { DynamicProgrammingAlgorithms } from '../algorithms/dp.comprehensive';
import { StringAlgorithms } from '../algorithms/string.comprehensive';

export interface Algorithm {
  id: string;
  name: string;
  category: string;
  description: string;
  complexity: {
    time: string;
    space: string;
  };
  code?: string;
  pseudocode?: string;
  useCases?: string[];
  advantages?: string[];
  disadvantages?: string[];
}

export const algorithms: Algorithm[] = [
  // ============ SORTING ALGORITHMS ============
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'sorting',
    description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.',
    complexity: { time: 'O(n²)', space: 'O(1)' },
    useCases: ['Educational purposes', 'Small datasets', 'Nearly sorted data'],
    advantages: ['Simple to understand', 'In-place sorting', 'Stable sort'],
    disadvantages: ['Very slow for large datasets', 'Poor average and worst-case performance'],
    code: `function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'sorting',
    description: 'An efficient divide-and-conquer sorting algorithm that picks a pivot element and partitions the array around it, then recursively sorts the sub-arrays.',
    complexity: { time: 'O(n log n) average, O(n²) worst', space: 'O(log n)' },
    useCases: ['General-purpose sorting', 'Large datasets', 'In-memory sorting'],
    advantages: ['Fast average-case performance', 'In-place sorting', 'Cache-friendly'],
    disadvantages: ['Unstable sort', 'Poor worst-case performance', 'Recursive overhead']
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'sorting',
    description: 'A stable divide-and-conquer algorithm that divides the array into halves, recursively sorts them, and then merges the sorted halves.',
    complexity: { time: 'O(n log n)', space: 'O(n)' },
    useCases: ['External sorting', 'Linked lists', 'Stable sorting required'],
    advantages: ['Guaranteed O(n log n)', 'Stable sort', 'Predictable performance'],
    disadvantages: ['Requires additional memory', 'Slower for small arrays', 'Not in-place']
  },
  {
    id: 'heap-sort',
    name: 'Heap Sort',
    category: 'sorting',
    description: 'A comparison-based sorting algorithm that uses a binary heap data structure to create a sorted array.',
    complexity: { time: 'O(n log n)', space: 'O(1)' },
    useCases: ['Large datasets', 'Memory-constrained environments', 'Priority queues'],
    advantages: ['In-place sorting', 'Guaranteed O(n log n)', 'No recursion overhead'],
    disadvantages: ['Not stable', 'Poor cache performance', 'Complex implementation']
  },
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    category: 'sorting',
    description: 'Builds the final sorted array one item at a time by inserting each element into its proper position.',
    complexity: { time: 'O(n²)', space: 'O(1)' },
    useCases: ['Small datasets', 'Nearly sorted data', 'Online sorting'],
    advantages: ['Simple implementation', 'Efficient for small data', 'Stable and adaptive'],
    disadvantages: ['Inefficient for large datasets', 'O(n²) complexity']
  },
  {
    id: 'selection-sort',
    name: 'Selection Sort',
    category: 'sorting',
    description: 'Divides the array into sorted and unsorted regions, repeatedly selecting the smallest element from the unsorted region.',
    complexity: { time: 'O(n²)', space: 'O(1)' },
    useCases: ['Small datasets', 'Memory-constrained systems'],
    advantages: ['Simple implementation', 'Minimal memory writes', 'In-place sorting'],
    disadvantages: ['Always O(n²)', 'Not stable', 'Not adaptive']
  },
  {
    id: 'radix-sort',
    name: 'Radix Sort',
    category: 'sorting',
    description: 'A non-comparative sorting algorithm that sorts integers by processing individual digits from least significant to most significant.',
    complexity: { time: 'O(d·n)', space: 'O(n + k)' },
    useCases: ['Integer sorting', 'Fixed-length strings', 'Parallel processing'],
    advantages: ['Linear time complexity', 'Stable sort', 'Good for integers'],
    disadvantages: ['Not in-place', 'Limited to integers/strings', 'Extra space required']
  },
  {
    id: 'counting-sort',
    name: 'Counting Sort',
    category: 'sorting',
    description: 'A non-comparative integer sorting algorithm that counts the number of objects with distinct key values.',
    complexity: { time: 'O(n + k)', space: 'O(k)' },
    useCases: ['Small range of integers', 'Histogram creation', 'As subroutine in Radix Sort'],
    advantages: ['Linear time complexity', 'Stable sort', 'Simple implementation'],
    disadvantages: ['Limited to integers', 'Extra space proportional to range', 'Not in-place']
  },
  {
    id: 'bucket-sort',
    name: 'Bucket Sort',
    category: 'sorting',
    description: 'Distributes elements into buckets, sorts each bucket individually, and then concatenates all buckets.',
    complexity: { time: 'O(n + k)', space: 'O(n + k)' },
    useCases: ['Uniformly distributed data', 'Floating-point numbers', 'External sorting'],
    advantages: ['Linear average-case time', 'Simple parallelization', 'Good for uniform data'],
    disadvantages: ['Requires extra space', 'Sensitive to distribution', 'Variable performance']
  },
  {
    id: 'shell-sort',
    name: 'Shell Sort',
    category: 'sorting',
    description: 'An optimization of insertion sort that allows exchange of items that are far apart, using gap sequences.',
    complexity: { time: 'O(n log² n)', space: 'O(1)' },
    useCases: ['Medium-sized datasets', 'Embedded systems', 'In-place sorting needed'],
    advantages: ['Better than O(n²) algorithms', 'In-place sorting', 'Simple to implement'],
    disadvantages: ['Complex analysis', 'Not stable', 'Gap sequence choice matters']
  },
  {
    id: 'cocktail-sort',
    name: 'Cocktail Shaker Sort',
    category: 'sorting',
    description: 'A bidirectional variant of bubble sort that sorts in both directions on each pass through the list.',
    complexity: { time: 'O(n²)', space: 'O(1)' },
    useCases: ['Partially sorted arrays', 'Educational purposes'],
    advantages: ['Slightly better than bubble sort', 'Stable sort', 'In-place'],
    disadvantages: ['Still O(n²)', 'Rarely used in practice']
  },
  {
    id: 'comb-sort',
    name: 'Comb Sort',
    category: 'sorting',
    description: 'An improvement over bubble sort that eliminates turtles (small values near end) using gap sequences.',
    complexity: { time: 'O(n²/2ᵖ) where p is increments', space: 'O(1)' },
    useCases: ['Quick implementation needed', 'Reasonably fast for most data'],
    advantages: ['Faster than bubble sort', 'Simple to implement', 'In-place'],
    disadvantages: ['Not as fast as O(n log n) algorithms', 'Not stable']
  },

  // ============ SEARCHING ALGORITHMS ============
  {
    id: 'linear-search',
    name: 'Linear Search',
    category: 'searching',
    description: 'A simple search algorithm that checks every element in the array sequentially until the target is found.',
    complexity: { time: 'O(n)', space: 'O(1)' },
    useCases: ['Unsorted arrays', 'Small datasets', 'Single search operation'],
    advantages: ['Works on unsorted data', 'Simple implementation', 'No preprocessing needed'],
    disadvantages: ['Slow for large datasets', 'Not efficient']
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'searching',
    description: 'An efficient algorithm for finding an item in a sorted array by repeatedly dividing the search interval in half.',
    complexity: { time: 'O(log n)', space: 'O(1)' },
    useCases: ['Sorted arrays', 'Dictionary lookups', 'Database indexing'],
    advantages: ['Very fast', 'Logarithmic time', 'Simple logic'],
    disadvantages: ['Requires sorted array', 'Random access needed']
  },
  {
    id: 'jump-search',
    name: 'Jump Search',
    category: 'searching',
    description: 'Works on sorted arrays by jumping ahead by fixed steps and then performing linear search.',
    complexity: { time: 'O(√n)', space: 'O(1)' },
    useCases: ['Sorted arrays', 'Better than linear', 'Disk-based searches'],
    advantages: ['Better than linear search', 'Simple implementation', 'Works on linked lists'],
    disadvantages: ['Requires sorted array', 'Slower than binary search']
  },
  {
    id: 'interpolation-search',
    name: 'Interpolation Search',
    category: 'searching',
    description: 'An improved variant of binary search for uniformly distributed sorted arrays using interpolation formula.',
    complexity: { time: 'O(log log n) average', space: 'O(1)' },
    useCases: ['Uniformly distributed data', 'Phone books', 'Dictionary searches'],
    advantages: ['Faster than binary search for uniform data', 'Adaptive search'],
    disadvantages: ['Requires sorted array', 'Poor for non-uniform data']
  },
  {
    id: 'exponential-search',
    name: 'Exponential Search',
    category: 'searching',
    description: 'Finds range where element is present then performs binary search in that range.',
    complexity: { time: 'O(log n)', space: 'O(1)' },
    useCases: ['Unbounded/infinite arrays', 'Unknown array size'],
    advantages: ['Works on unbounded arrays', 'Better for small target indices'],
    disadvantages: ['Requires sorted array', 'Two-step process']
  },
  {
    id: 'ternary-search',
    name: 'Ternary Search',
    category: 'searching',
    description: 'Divides the array into three parts and determines which part contains the target.',
    complexity: { time: 'O(log₃ n)', space: 'O(1)' },
    useCases: ['Sorted arrays', 'Finding max/min in unimodal functions'],
    advantages: ['Alternative to binary search', 'Useful for optimization'],
    disadvantages: ['More comparisons than binary search', 'Slower in practice']
  },
  {
    id: 'fibonacci-search',
    name: 'Fibonacci Search',
    category: 'searching',
    description: 'Uses Fibonacci numbers to divide array and search, similar to binary search.',
    complexity: { time: 'O(log n)', space: 'O(1)' },
    useCases: ['Large datasets', 'Tape/sequential storage'],
    advantages: ['Division-free algorithm', 'Good for sequential access'],
    disadvantages: ['Complex implementation', 'Requires sorted array']
  },

  // ============ GRAPH ALGORITHMS ============
  {
    id: 'bfs',
    name: 'Breadth-First Search',
    category: 'graph',
    description: 'Explores all vertices at the present depth before moving to vertices at the next depth level.',
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    useCases: ['Shortest path in unweighted graphs', 'Level-order traversal', 'Web crawling'],
    advantages: ['Finds shortest path', 'Complete algorithm', 'Optimal for unweighted graphs'],
    disadvantages: ['High memory usage', 'Not optimal for weighted graphs']
  },
  {
    id: 'dfs',
    name: 'Depth-First Search',
    category: 'graph',
    description: 'Explores as far as possible along each branch before backtracking.',
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    useCases: ['Topological sorting', 'Cycle detection', 'Path finding'],
    advantages: ['Memory efficient', 'Simple implementation', 'Good for sparse graphs'],
    disadvantages: ['May not find shortest path', 'Can get stuck in deep branches']
  },
  {
    id: 'dijkstra',
    name: "Dijkstra's Algorithm",
    category: 'graph',
    description: 'Finds the shortest paths between nodes in a weighted graph with non-negative edge weights.',
    complexity: { time: 'O((V + E) log V)', space: 'O(V)' },
    useCases: ['GPS navigation', 'Network routing', 'Map applications'],
    advantages: ['Optimal for non-negative weights', 'Well-established', 'Widely used'],
    disadvantages: ['Cannot handle negative weights', 'Slower than A* with good heuristic']
  },
  {
    id: 'bellman-ford',
    name: 'Bellman-Ford Algorithm',
    category: 'graph',
    description: 'Computes shortest paths from a single source vertex to all other vertices, handles negative edge weights.',
    complexity: { time: 'O(VE)', space: 'O(V)' },
    useCases: ['Graphs with negative weights', 'Network routing protocols', 'Currency arbitrage'],
    advantages: ['Handles negative weights', 'Detects negative cycles', 'Simpler than Dijkstra'],
    disadvantages: ['Slower than Dijkstra', 'High time complexity']
  },
  {
    id: 'floyd-warshall',
    name: 'Floyd-Warshall Algorithm',
    category: 'graph',
    description: 'Finds shortest paths between all pairs of vertices in a weighted graph.',
    complexity: { time: 'O(V³)', space: 'O(V²)' },
    useCases: ['All-pairs shortest paths', 'Transitive closure', 'Dense graphs'],
    advantages: ['Finds all-pairs paths', 'Handles negative edges', 'Simple implementation'],
    disadvantages: ['Very slow for large graphs', 'High space complexity']
  },
  {
    id: 'kruskal',
    name: "Kruskal's Algorithm",
    category: 'graph',
    description: 'Finds a minimum spanning tree for a weighted undirected graph using edge sorting.',
    complexity: { time: 'O(E log E)', space: 'O(V)' },
    useCases: ['Network design', 'Clustering', 'Approximation algorithms'],
    advantages: ['Works on disconnected graphs', 'Easy to implement', 'Efficient for sparse graphs'],
    disadvantages: ['Requires sorting edges', 'Union-find overhead']
  },
  {
    id: 'prim',
    name: "Prim's Algorithm",
    category: 'graph',
    description: 'Builds a minimum spanning tree by growing from an arbitrary starting vertex.',
    complexity: { time: 'O(E log V)', space: 'O(V)' },
    useCases: ['Network design', 'Maze generation', 'Dense graphs'],
    advantages: ['Better for dense graphs', 'More efficient with heaps', 'Simpler for dense graphs'],
    disadvantages: ['Requires starting vertex', 'Higher space complexity']
  },

  // ============ DYNAMIC PROGRAMMING ============
  {
    id: 'fibonacci-dp',
    name: 'Fibonacci (DP)',
    category: 'dynamic-programming',
    description: 'Computes Fibonacci numbers efficiently using dynamic programming with memoization.',
    complexity: { time: 'O(n)', space: 'O(n)' },
    useCases: ['Introduction to DP', 'Sequence generation', 'Teaching recursion'],
    advantages: ['Linear time', 'Simple example', 'Clear optimization'],
    disadvantages: ['Can be done in O(1) space', 'Limited practical use']
  },
  {
    id: 'knapsack',
    name: '0/1 Knapsack',
    category: 'dynamic-programming',
    description: 'Finds the maximum value subset of items that fit in a knapsack of limited capacity.',
    complexity: { time: 'O(nW)', space: 'O(nW)' },
    useCases: ['Resource allocation', 'Budget optimization', 'Cargo loading'],
    advantages: ['Exact solution', 'Handles discrete items', 'Classic DP problem'],
    disadvantages: ['Pseudo-polynomial time', 'High space for large capacity']
  },
  {
    id: 'lcs',
    name: 'Longest Common Subsequence',
    category: 'dynamic-programming',
    description: 'Finds the longest subsequence common to two sequences.',
    complexity: { time: 'O(mn)', space: 'O(mn)' },
    useCases: ['Diff utilities', 'DNA sequence alignment', 'Version control'],
    advantages: ['Exact solution', 'Useful in bioinformatics', 'Clear DP formulation'],
    disadvantages: ['Quadratic space', 'Not suitable for very long sequences']
  },
  {
    id: 'edit-distance',
    name: 'Edit Distance',
    category: 'dynamic-programming',
    description: 'Computes minimum operations (insert, delete, replace) to convert one string to another.',
    complexity: { time: 'O(mn)', space: 'O(mn)' },
    useCases: ['Spell checkers', 'DNA sequence comparison', 'Natural language processing'],
    advantages: ['Versatile metric', 'Well-studied', 'Many applications'],
    disadvantages: ['Quadratic complexity', 'Space-intensive']
  },
  {
    id: 'coin-change',
    name: 'Coin Change',
    category: 'dynamic-programming',
    description: 'Finds minimum number of coins needed to make a given amount.',
    complexity: { time: 'O(n·amount)', space: 'O(amount)' },
    useCases: ['Currency systems', 'Vending machines', 'Making change'],
    advantages: ['Practical application', 'Clear DP structure', 'Optimal solution'],
    disadvantages: ['Pseudo-polynomial', 'Assumes unlimited coins']
  },
  {
    id: 'matrix-chain',
    name: 'Matrix Chain Multiplication',
    category: 'dynamic-programming',
    description: 'Finds the most efficient way to multiply a chain of matrices.',
    complexity: { time: 'O(n³)', space: 'O(n²)' },
    useCases: ['Compiler optimization', 'Graphics processing', 'Scientific computing'],
    advantages: ['Significantly reduces operations', 'Classic optimization', 'Practical use'],
    disadvantages: ['Cubic time', 'Complex backtracking']
  },
  {
    id: 'lis',
    name: 'Longest Increasing Subsequence',
    category: 'dynamic-programming',
    description: 'Finds the longest subsequence where elements are in increasing order.',
    complexity: { time: 'O(n²) or O(n log n)', space: 'O(n)' },
    useCases: ['Patience sorting', 'Stock analysis', 'Scheduling problems'],
    advantages: ['Multiple approaches', 'Can be optimized', 'Useful pattern'],
    disadvantages: ['Subsequence vs subarray confusion', 'Multiple optimal solutions']
  },

  // ============ STRING ALGORITHMS ============
  {
    id: 'naive-search',
    name: 'Naive Pattern Matching',
    category: 'string',
    description: 'Simple pattern matching by checking pattern at every position in text.',
    complexity: { time: 'O(nm)', space: 'O(1)' },
    useCases: ['Teaching pattern matching', 'Small strings', 'Simple implementations'],
    advantages: ['Simple to understand', 'No preprocessing', 'Low space'],
    disadvantages: ['Slow for large texts', 'Inefficient', 'Many redundant comparisons']
  },
  {
    id: 'kmp',
    name: 'Knuth-Morris-Pratt (KMP)',
    category: 'string',
    description: 'Efficient pattern matching using failure function to avoid redundant comparisons.',
    complexity: { time: 'O(n + m)', space: 'O(m)' },
    useCases: ['Text editors', 'Search engines', 'Bioinformatics'],
    advantages: ['Linear time', 'No backtracking in text', 'Guaranteed performance'],
    disadvantages: ['Complex preprocessing', 'LPS array overhead']
  },
  {
    id: 'rabin-karp',
    name: 'Rabin-Karp Algorithm',
    category: 'string',
    description: 'Uses rolling hash function for pattern matching, efficient for multiple pattern search.',
    complexity: { time: 'O(n + m) average', space: 'O(1)' },
    useCases: ['Plagiarism detection', 'Multiple pattern search', 'Document comparison'],
    advantages: ['Good for multiple patterns', 'Simple concept', 'Average-case linear'],
    disadvantages: ['Spurious hits possible', 'Hash collisions', 'Worst case O(nm)']
  },
  {
    id: 'boyer-moore',
    name: 'Boyer-Moore Algorithm',
    category: 'string',
    description: 'Efficient pattern matching using bad character and good suffix heuristics.',
    complexity: { time: 'O(n/m) best, O(nm) worst', space: 'O(m)' },
    useCases: ['Text editors', 'grep command', 'Large text search'],
    advantages: ['Very fast in practice', 'Sublinear in many cases', 'Industry standard'],
    disadvantages: ['Complex implementation', 'Preprocessing overhead', 'Complex analysis']
  },
  {
    id: 'z-algorithm',
    name: 'Z Algorithm',
    category: 'string',
    description: 'Computes Z-array for efficient pattern matching and string analysis.',
    complexity: { time: 'O(n + m)', space: 'O(n + m)' },
    useCases: ['Pattern matching', 'String analysis', 'Competitive programming'],
    advantages: ['Linear time', 'Versatile', 'Multiple applications'],
    disadvantages: ['Less known', 'Z-array concept', 'Space overhead']
  },
  {
    id: 'manacher',
    name: "Manacher's Algorithm",
    category: 'string',
    description: 'Finds longest palindromic substring in linear time.',
    complexity: { time: 'O(n)', space: 'O(n)' },
    useCases: ['Palindrome problems', 'String analysis', 'Competitive programming'],
    advantages: ['Linear time', 'Elegant solution', 'Optimal complexity'],
    disadvantages: ['Complex to understand', 'String transformation needed', 'Limited use case']
  }
];

export const algorithmsByCategory = {
  sorting: algorithms.filter(a => a.category === 'sorting'),
  searching: algorithms.filter(a => a.category === 'searching'),
  graph: algorithms.filter(a => a.category === 'graph'),
  'dynamic-programming': algorithms.filter(a => a.category === 'dynamic-programming'),
  string: algorithms.filter(a => a.category === 'string'),
};

export const algorithmExecutors = {
  // Sorting
  'bubble-sort': sortingAlgorithms.bubbleSort,
  'quick-sort': sortingAlgorithms.quickSort,
  'merge-sort': sortingAlgorithms.mergeSort,
  'heap-sort': sortingAlgorithms.heapSort,
  'insertion-sort': sortingAlgorithms.insertionSort,
  'selection-sort': sortingAlgorithms.selectionSort,
  'radix-sort': sortingAlgorithms.radixSort,
  'counting-sort': sortingAlgorithms.countingSort,
  'bucket-sort': sortingAlgorithms.bucketSort,
  'shell-sort': sortingAlgorithms.shellSort,
  'cocktail-sort': sortingAlgorithms.cocktailSort,
  'comb-sort': sortingAlgorithms.combSort,

  // Searching
  'linear-search': searchingAlgorithms.linearSearch,
  'binary-search': searchingAlgorithms.binarySearch,
  'jump-search': searchingAlgorithms.jumpSearch,
  'interpolation-search': searchingAlgorithms.interpolationSearch,
  'exponential-search': searchingAlgorithms.exponentialSearch,
  'ternary-search': searchingAlgorithms.ternarySearch,
  'fibonacci-search': searchingAlgorithms.fibonacciSearch,

  // Graph
  'bfs': GraphAlgorithms.bfs,
  'dfs': GraphAlgorithms.dfs,
  'dijkstra': GraphAlgorithms.dijkstra,
  'bellman-ford': GraphAlgorithms.bellmanFord,
  'floyd-warshall': GraphAlgorithms.floydWarshall,
  'kruskal': GraphAlgorithms.kruskal,
  'prim': GraphAlgorithms.prim,

  // Dynamic Programming
  'fibonacci-dp': DynamicProgrammingAlgorithms.fibonacci,
  'knapsack': DynamicProgrammingAlgorithms.knapsack,
  'lcs': DynamicProgrammingAlgorithms.longestCommonSubsequence,
  'edit-distance': DynamicProgrammingAlgorithms.editDistance,
  'coin-change': DynamicProgrammingAlgorithms.coinChange,
  'matrix-chain': DynamicProgrammingAlgorithms.matrixChainMultiplication,
  'lis': DynamicProgrammingAlgorithms.longestIncreasingSubsequence,

  // String
  'naive-search': StringAlgorithms.naiveSearch,
  'kmp': StringAlgorithms.kmpSearch,
  'rabin-karp': StringAlgorithms.rabinKarpSearch,
  'boyer-moore': StringAlgorithms.boyerMooreSearch,
  'z-algorithm': StringAlgorithms.zAlgorithm,
  'manacher': StringAlgorithms.manacherAlgorithm,
};
