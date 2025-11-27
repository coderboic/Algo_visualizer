import { Algorithm } from '../services/algorithm.service';

export const algorithms: Algorithm[] = [
  // Sorting Algorithms
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'sorting',
    description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    complexity: {
      time: 'O(n²)',
      space: 'O(1)'
    },
    code: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      visualize({ array: arr, comparing: [j, j + 1] });
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        visualize({ array: arr, swapping: [j, j + 1] });
      }
    }
    mark(n - i - 1, 'sorted');
  }
  return arr;
  }`
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'sorting',
    description: 'An efficient divide-and-conquer sorting algorithm that picks a pivot element and partitions the array around it.',
    complexity: {
      time: 'O(n log n) average, O(n²) worst',
      space: 'O(log n)'
    }
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'sorting',
    description: 'A divide-and-conquer algorithm that divides the array into halves, sorts them, and then merges them back together.',
    complexity: {
      time: 'O(n log n)',
      space: 'O(n)'
    }
  },
  {
    id: 'heap-sort',
    name: 'Heap Sort',
    category: 'sorting',
    description: 'A comparison-based sorting algorithm that uses a binary heap data structure.',
    complexity: {
      time: 'O(n log n)',
      space: 'O(1)'
    }
  },
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    category: 'sorting',
    description: 'Builds the final sorted array one item at a time by inserting each element into its proper position.',
    complexity: {
      time: 'O(n²)',
      space: 'O(1)'
    }
  },
  {
    id: 'selection-sort',
    name: 'Selection Sort',
    category: 'sorting',
    description: 'Divides the array into sorted and unsorted regions, repeatedly selecting the smallest element from the unsorted region.',
    complexity: {
      time: 'O(n²)',
      space: 'O(1)'
    }
  },

  // Searching Algorithms
  {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'searching',
    description: 'An efficient algorithm for finding an item in a sorted array by repeatedly dividing the search interval in half.',
    complexity: {
      time: 'O(log n)',
      space: 'O(1)'
    }
  },
  {
    id: 'linear-search',
    name: 'Linear Search',
    category: 'searching',
    description: 'A simple search algorithm that checks every element in the array sequentially.',
    complexity: {
      time: 'O(n)',
      space: 'O(1)'
    }
  },
  {
    id: 'jump-search',
    name: 'Jump Search',
    category: 'searching',
    description: 'Works on sorted arrays by jumping ahead by fixed steps and then performing linear search.',
    complexity: {
      time: 'O(√n)',
      space: 'O(1)'
    }
  },

  // Graph Algorithms
  {
    id: 'bfs',
    name: 'Breadth-First Search',
    category: 'graph',
    description: 'Explores all vertices at the present depth before moving to vertices at the next depth level.',
    complexity: {
      time: 'O(V + E)',
      space: 'O(V)'
    }
  },
  {
    id: 'dfs',
    name: 'Depth-First Search',
    category: 'graph',
    description: 'Explores as far as possible along each branch before backtracking.',
    complexity: {
      time: 'O(V + E)',
      space: 'O(V)'
    }
  },
  {
    id: 'dijkstra',
    name: "Dijkstra's Algorithm",
    category: 'graph',
    description: 'Finds the shortest paths between nodes in a weighted graph.',
    complexity: {
      time: 'O((V + E) log V)',
      space: 'O(V)'
    }
  },
  {
    id: 'bellman-ford',
    name: 'Bellman-Ford Algorithm',
    category: 'graph',
    description: 'Computes shortest paths from a single source vertex to all other vertices, even with negative edge weights.',
    complexity: {
      time: 'O(VE)',
      space: 'O(V)'
    }
  },
  {
    id: 'kruskal',
    name: "Kruskal's Algorithm",
    category: 'graph',
    description: 'Finds a minimum spanning tree for a weighted undirected graph.',
    complexity: {
      time: 'O(E log E)',
      space: 'O(V)'
    }
  },
  {
    id: 'prim',
    name: "Prim's Algorithm",
    category: 'graph',
    description: 'Builds a minimum spanning tree by growing from an arbitrary starting vertex.',
    complexity: {
      time: 'O(E log V)',
      space: 'O(V)'
    }
  },

  // Tree Algorithms
  {
    id: 'bst-insert',
    name: 'BST Insertion',
    category: 'tree',
    description: 'Inserts a new node into a Binary Search Tree while maintaining the BST property.',
    complexity: {
      time: 'O(log n) average, O(n) worst',
      space: 'O(1)'
    }
  },
  {
    id: 'bst-search',
    name: 'BST Search',
    category: 'tree',
    description: 'Searches for a value in a Binary Search Tree.',
    complexity: {
      time: 'O(log n) average, O(n) worst',
      space: 'O(1)'
    }
  },
  {
    id: 'tree-traversal',
    name: 'Tree Traversals',
    category: 'tree',
    description: 'Different ways to visit all nodes in a tree: Inorder, Preorder, Postorder, and Level-order.',
    complexity: {
      time: 'O(n)',
      space: 'O(h) where h is height'
    }
  },
  {
    id: 'avl-tree',
    name: 'AVL Tree Operations',
    category: 'tree',
    description: 'Self-balancing binary search tree operations including rotations.',
    complexity: {
      time: 'O(log n)',
      space: 'O(1)'
    }
  },

  // Dynamic Programming
  {
    id: 'fibonacci',
    name: 'Fibonacci Sequence',
    category: 'dynamic-programming',
    description: 'Calculates Fibonacci numbers using dynamic programming to avoid redundant calculations.',
    complexity: {
      time: 'O(n)',
      space: 'O(n)'
    }
  },
  {
    id: 'knapsack',
    name: '0/1 Knapsack',
    category: 'dynamic-programming',
    description: 'Solves the knapsack problem to find the maximum value that can be obtained with a given weight limit.',
    complexity: {
      time: 'O(nW)',
      space: 'O(nW)'
    }
  },
  {
    id: 'lcs',
    name: 'Longest Common Subsequence',
    category: 'dynamic-programming',
    description: 'Finds the longest subsequence common to two sequences.',
    complexity: {
      time: 'O(mn)',
      space: 'O(mn)'
    }
  },
  {
    id: 'edit-distance',
    name: 'Edit Distance',
    category: 'dynamic-programming',
    description: 'Calculates the minimum number of operations required to convert one string into another.',
    complexity: {
      time: 'O(mn)',
      space: 'O(mn)'
    }
  }
];