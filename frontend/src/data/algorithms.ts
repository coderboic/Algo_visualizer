export const algorithmCategories = [
  {
    id: 'data-structures',
    name: 'Data Structures',
    description: 'Understand fundamental data structures and their operations',
    algorithms: [
      {
        id: 'array',
        name: 'Array',
        description: 'Contiguous memory storage with O(1) access time',
        complexity: { time: 'Access: O(1), Search: O(n)', space: 'O(n)' }
      },
      {
        id: 'linked-list',
        name: 'Linked List',
        description: 'Linear data structure with nodes containing data and pointers',
        complexity: { time: 'Insert/Delete: O(1) at head', space: 'O(n)' }
      },
      {
        id: 'stack',
        name: 'Stack',
        description: 'LIFO (Last In First Out) data structure',
        complexity: { time: 'Push/Pop: O(1)', space: 'O(n)' }
      },
      {
        id: 'queue',
        name: 'Queue',
        description: 'FIFO (First In First Out) data structure',
        complexity: { time: 'Enqueue/Dequeue: O(1)', space: 'O(n)' }
      }
    ]
  },
  {
    id: 'sorting',
    name: 'Sorting Algorithms',
    description: 'Learn about different sorting techniques and compare their performance',
    algorithms: [
      {
        id: 'bubble-sort',
        name: 'Bubble Sort',
        description: 'Simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in wrong order',
        complexity: { time: 'O(n²)', space: 'O(1)' }
      },
      {
        id: 'selection-sort',
        name: 'Selection Sort',
        description: 'Divides array into sorted and unsorted regions, repeatedly selects minimum element from unsorted region',
        complexity: { time: 'O(n²)', space: 'O(1)' }
      },
      {
        id: 'insertion-sort',
        name: 'Insertion Sort',
        description: 'Builds final sorted array one item at a time by inserting each element into its proper position',
        complexity: { time: 'O(n²)', space: 'O(1)' }
      },
      {
        id: 'merge-sort',
        name: 'Merge Sort',
        description: 'Stable divide-and-conquer algorithm that divides array into halves, recursively sorts them, and merges the sorted halves',
        complexity: { time: 'O(n log n)', space: 'O(n)' }
      },
      {
        id: 'quick-sort',
        name: 'Quick Sort',
        description: 'Efficient divide-and-conquer algorithm that picks a pivot element and partitions array around it',
        complexity: { time: 'O(n log n) avg', space: 'O(log n)' }
      }
    ]
  },
  {
    id: 'searching',
    name: 'Search Algorithms',
    description: 'Master different searching techniques for finding elements efficiently',
    algorithms: [
      {
        id: 'linear-search',
        name: 'Linear Search',
        description: 'Sequential search checking each element one by one until target is found',
        complexity: { time: 'O(n)', space: 'O(1)' }
      },
      {
        id: 'binary-search',
        name: 'Binary Search',
        description: 'Efficient search in sorted arrays by repeatedly dividing search space in half',
        complexity: { time: 'O(log n)', space: 'O(1)' }
      }
    ]
  },
  {
    id: 'graph',
    name: 'Graph Algorithms',
    description: 'Explore graph traversal and shortest path algorithms',
    algorithms: [
      {
        id: 'bfs',
        name: 'Breadth-First Search',
        description: 'Graph traversal algorithm that explores neighbor nodes first before moving to next level',
        complexity: { time: 'O(V + E)', space: 'O(V)' }
      },
      {
        id: 'dfs',
        name: 'Depth-First Search',
        description: 'Graph traversal algorithm that explores as far as possible along each branch',
        complexity: { time: 'O(V + E)', space: 'O(V)' }
      },
      {
        id: 'dijkstra',
        name: "Dijkstra's Algorithm",
        description: 'Finds shortest path between nodes in a weighted graph',
        complexity: { time: 'O((V + E) log V)', space: 'O(V)' }
      }
    ]
  }
];

export const getAllAlgorithms = () => {
  return algorithmCategories.flatMap(category => 
    category.algorithms.map(algorithm => ({
      ...algorithm,
      category: category.id,
      categoryName: category.name
    }))
  );
};
