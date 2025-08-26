export const algorithmCategories = [
  {
    id: 'sorting',
    name: 'Sorting Algorithms',
    description: 'Learn about different sorting techniques',
    algorithms: [
      {
        id: 'bubble-sort',
        name: 'Bubble Sort',
        description: 'A simple sorting algorithm that repeatedly steps through the list',
        complexity: { time: 'O(n²)', space: 'O(1)' }
      },
      {
        id: 'quick-sort',
        name: 'Quick Sort',
        description: 'A divide-and-conquer algorithm that picks a pivot element',
        complexity: { time: 'O(n log n)', space: 'O(log n)' }
      },
      {
        id: 'merge-sort',
        name: 'Merge Sort',
        description: 'A stable sorting algorithm that uses divide-and-conquer approach',
        complexity: { time: 'O(n log n)', space: 'O(n)' }
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
        description: 'Graph traversal algorithm that explores neighbor nodes first',
        complexity: { time: 'O(V + E)', space: 'O(V)' }
      },
      {
        id: 'dfs',
        name: 'Depth-First Search',
        description: 'Graph traversal algorithm that explores as far as possible',
        complexity: { time: 'O(V + E)', space: 'O(V)' }
      },
      {
        id: 'dijkstra',
        name: "Dijkstra's Algorithm",
        description: 'Finds the shortest path between nodes in a graph',
        complexity: { time: 'O((V + E) log V)', space: 'O(V)' }
      }
    ]
  },
  {
    id: 'search',
    name: 'Search Algorithms',
    description: 'Learn about different searching techniques',
    algorithms: [
      {
        id: 'linear-search',
        name: 'Linear Search',
        description: 'Sequential search through elements one by one',
        complexity: { time: 'O(n)', space: 'O(1)' }
      },
      {
        id: 'binary-search',
        name: 'Binary Search',
        description: 'Efficient search in sorted arrays using divide-and-conquer',
        complexity: { time: 'O(log n)', space: 'O(1)' }
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
