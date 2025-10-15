export interface VisualizationStep {
  type: string;
  array: number[];
  comparing?: number[];
  swapping?: number[];
  sorted?: number[];
  pivot?: number;
  partitioned?: number[];
  auxiliary?: number[];
  description: string;
  highlightedIndices?: number[];
  range?: number[];
  buckets?: number[][];
}

export const sortingAlgorithms = {
  // Bubble Sort
  bubbleSort(array: number[]): VisualizationStep[] {
    const steps: VisualizationStep[] = [];
    const arr = [...array];
    const n = arr.length;
    const sorted: number[] = [];

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;
      for (let j = 0; j < n - i - 1; j++) {
        steps.push({
          type: 'compare',
          array: [...arr],
          comparing: [j, j + 1],
          sorted: [...sorted],
          description: `Comparing elements at indices ${j} and ${j + 1}: ${arr[j]} and ${arr[j + 1]}`
        });

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swapped = true;
          steps.push({
            type: 'swap',
            array: [...arr],
            swapping: [j, j + 1],
            sorted: [...sorted],
            description: `Swapping ${arr[j + 1]} and ${arr[j]}`
          });
        }
      }
      sorted.unshift(n - i - 1);
      steps.push({
        type: 'sorted',
        array: [...arr],
        sorted: [...sorted],
        description: `Element at index ${n - i - 1} is now in its final position`
      });
      if (!swapped) break;
    }
    
    sorted.unshift(0);
    steps.push({
      type: 'complete',
      array: [...arr],
      sorted: [...sorted],
      description: 'Array is now fully sorted!'
    });

    return steps;
  },

  // Quick Sort
  quickSort(array: number[]): VisualizationStep[] {
    const steps: VisualizationStep[] = [];
    const arr = [...array];
    const sorted = new Set<number>();

    function partition(low: number, high: number): number {
      const pivot = arr[high];
      steps.push({
        type: 'pivot',
        array: [...arr],
        pivot: high,
        sorted: Array.from(sorted),
        description: `Selected pivot: ${pivot} at index ${high}`,
        range: [low, high]
      });

      let i = low - 1;
      for (let j = low; j < high; j++) {
        steps.push({
          type: 'compare',
          array: [...arr],
          comparing: [j, high],
          pivot: high,
          sorted: Array.from(sorted),
          description: `Comparing ${arr[j]} with pivot ${pivot}`
        });

        if (arr[j] < pivot) {
          i++;
          if (i !== j) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
            steps.push({
              type: 'swap',
              array: [...arr],
              swapping: [i, j],
              pivot: high,
              sorted: Array.from(sorted),
              description: `Swapping ${arr[i]} and ${arr[j]}`
            });
          }
        }
      }

      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      const pivotIndex = i + 1;
      sorted.add(pivotIndex);
      
      steps.push({
        type: 'swap',
        array: [...arr],
        swapping: [i + 1, high],
        pivot: pivotIndex,
        sorted: Array.from(sorted),
        description: `Placing pivot ${pivot} at its final position ${pivotIndex}`
      });

      return pivotIndex;
    }

    function quickSortHelper(low: number, high: number) {
      if (low < high) {
        const pi = partition(low, high);
        quickSortHelper(low, pi - 1);
        quickSortHelper(pi + 1, high);
      } else if (low === high) {
        sorted.add(low);
      }
    }

    quickSortHelper(0, arr.length - 1);
    
    steps.push({
      type: 'complete',
      array: [...arr],
      sorted: Array.from(sorted),
      description: 'Array is now fully sorted!'
    });

    return steps;
  },

  // Merge Sort
  mergeSort(array: number[]): VisualizationStep[] {
    const steps: VisualizationStep[] = [];
    const arr = [...array];
    const sorted = new Set<number>();

    function merge(left: number, mid: number, right: number) {
      const leftArr = arr.slice(left, mid + 1);
      const rightArr = arr.slice(mid + 1, right + 1);
      
      steps.push({
        type: 'split',
        array: [...arr],
        auxiliary: [...leftArr, ...rightArr],
        highlightedIndices: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
        sorted: Array.from(sorted),
        description: `Merging segments [${left}...${mid}] and [${mid + 1}...${right}]`,
        range: [left, right]
      });

      let i = 0, j = 0, k = left;

      while (i < leftArr.length && j < rightArr.length) {
        steps.push({
          type: 'compare',
          array: [...arr],
          comparing: [left + i, mid + 1 + j],
          sorted: Array.from(sorted),
          description: `Comparing ${leftArr[i]} and ${rightArr[j]}`
        });

        if (leftArr[i] <= rightArr[j]) {
          arr[k] = leftArr[i];
          i++;
        } else {
          arr[k] = rightArr[j];
          j++;
        }
        k++;

        steps.push({
          type: 'merge',
          array: [...arr],
          highlightedIndices: [k - 1],
          sorted: Array.from(sorted),
          description: `Placed ${arr[k - 1]} at position ${k - 1}`
        });
      }

      while (i < leftArr.length) {
        arr[k++] = leftArr[i++];
      }

      while (j < rightArr.length) {
        arr[k++] = rightArr[j++];
      }

      for (let idx = left; idx <= right; idx++) {
        sorted.add(idx);
      }

      steps.push({
        type: 'merged',
        array: [...arr],
        sorted: Array.from(sorted),
        description: `Merged segment [${left}...${right}]`,
        range: [left, right]
      });
    }

    function mergeSortHelper(left: number, right: number) {
      if (left >= right) {
        sorted.add(left);
        return;
      }

      const mid = Math.floor((left + right) / 2);
      
      steps.push({
        type: 'divide',
        array: [...arr],
        highlightedIndices: [left, mid, right],
        sorted: Array.from(sorted),
        description: `Dividing array segment [${left}...${right}] at midpoint ${mid}`,
        range: [left, right]
      });

      mergeSortHelper(left, mid);
      mergeSortHelper(mid + 1, right);
      merge(left, mid, right);
    }

    mergeSortHelper(0, arr.length - 1);
    
    steps.push({
      type: 'complete',
      array: [...arr],
      sorted: Array.from(sorted),
      description: 'Array is now fully sorted!'
    });

    return steps;
  },

  // Heap Sort
  heapSort(array: number[]): VisualizationStep[] {
    const steps: VisualizationStep[] = [];
    const arr = [...array];
    const n = arr.length;
    const sorted: number[] = [];

    function heapify(size: number, i: number) {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      if (left < size) {
        steps.push({
          type: 'compare',
          array: [...arr],
          comparing: [largest, left],
          description: `Comparing parent ${arr[largest]} with left child ${arr[left]}`
        });
        
        if (arr[left] > arr[largest]) {
          largest = left;
        }
      }

      if (right < size) {
        steps.push({
          type: 'compare',
          array: [...arr],
          comparing: [largest, right],
          description: `Comparing ${arr[largest]} with right child ${arr[right]}`
        });
        
        if (arr[right] > arr[largest]) {
          largest = right;
        }
      }

      if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        steps.push({
          type: 'swap',
          array: [...arr],
          swapping: [i, largest],
          description: `Swapping ${arr[i]} and ${arr[largest]} to maintain heap property`
        });
        heapify(size, largest);
      }
    }

    steps.push({
      type: 'build-heap',
      array: [...arr],
      sorted,
      description: 'Building max heap from array'
    });

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(n, i);
    }

    steps.push({
      type: 'heap-built',
      array: [...arr],
      sorted,
      description: 'Max heap constructed'
    });

    // Extract elements from heap
    for (let i = n - 1; i > 0; i--) {
      [arr[0], arr[i]] = [arr[i], arr[0]];
      sorted.unshift(i);
      
      steps.push({
        type: 'swap',
        array: [...arr],
        swapping: [0, i],
        sorted: [...sorted],
        description: `Moving max element ${arr[i]} to position ${i}`
      });

      heapify(i, 0);
    }

    sorted.unshift(0);
    steps.push({
      type: 'complete',
      array: [...arr],
      sorted,
      description: 'Array is now fully sorted!'
    });

    return steps;
  },

  // Insertion Sort
  insertionSort(array: number[]): VisualizationStep[] {
    const steps: VisualizationStep[] = [];
    const arr = [...array];
    const sorted = [0];

    for (let i = 1; i < arr.length; i++) {
      const key = arr[i];
      let j = i - 1;

      steps.push({
        type: 'select',
        array: [...arr],
        highlightedIndices: [i],
        sorted: [...sorted],
        description: `Selecting element ${key} at index ${i} to insert into sorted portion`
      });

      while (j >= 0) {
        steps.push({
          type: 'compare',
          array: [...arr],
          comparing: [j, i],
          sorted: [...sorted],
          description: `Comparing ${arr[j]} with ${key}`
        });

        if (arr[j] > key) {
          arr[j + 1] = arr[j];
          steps.push({
            type: 'shift',
            array: [...arr],
            swapping: [j, j + 1],
            sorted: [...sorted],
            description: `Shifting ${arr[j]} to the right`
          });
          j--;
        } else {
          break;
        }
      }

      arr[j + 1] = key;
      sorted.push(i);
      
      steps.push({
        type: 'insert',
        array: [...arr],
        highlightedIndices: [j + 1],
        sorted: [...sorted],
        description: `Inserted ${key} at position ${j + 1}`
      });
    }

    steps.push({
      type: 'complete',
      array: [...arr],
      sorted: [...sorted],
      description: 'Array is now fully sorted!'
    });

    return steps;
  },

  // Selection Sort
  selectionSort(array: number[]): VisualizationStep[] {
    const steps: VisualizationStep[] = [];
    const arr = [...array];
    const sorted: number[] = [];

    for (let i = 0; i < arr.length - 1; i++) {
      let minIdx = i;

      steps.push({
        type: 'find-min',
        array: [...arr],
        highlightedIndices: [minIdx],
        sorted: [...sorted],
        description: `Finding minimum element in unsorted portion starting from index ${i}`
      });

      for (let j = i + 1; j < arr.length; j++) {
        steps.push({
          type: 'compare',
          array: [...arr],
          comparing: [minIdx, j],
          sorted: [...sorted],
          description: `Comparing current minimum ${arr[minIdx]} with ${arr[j]}`
        });

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          steps.push({
            type: 'new-min',
            array: [...arr],
            highlightedIndices: [minIdx],
            sorted: [...sorted],
            description: `New minimum found: ${arr[minIdx]} at index ${minIdx}`
          });
        }
      }

      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        steps.push({
          type: 'swap',
          array: [...arr],
          swapping: [i, minIdx],
          sorted: [...sorted],
          description: `Swapping ${arr[i]} with minimum element ${arr[minIdx]}`
        });
      }

      sorted.push(i);
      steps.push({
        type: 'sorted',
        array: [...arr],
        sorted: [...sorted],
        description: `Element at index ${i} is now in its final position`
      });
    }

    sorted.push(arr.length - 1);
    steps.push({
      type: 'complete',
      array: [...arr],
      sorted,
      description: 'Array is now fully sorted!'
    });

    return steps;
  },

  // Radix Sort (LSD)
  radixSort(array: number[]): VisualizationStep[] {
    const steps: VisualizationStep[] = [];
    const arr = [...array];
    const max = Math.max(...arr);
    const maxDigits = Math.floor(Math.log10(max)) + 1;

    for (let digit = 0; digit < maxDigits; digit++) {
      const buckets: number[][] = Array.from({ length: 10 }, () => []);
      
      steps.push({
        type: 'pass-start',
        array: [...arr],
        description: `Starting pass for digit position ${digit + 1} (from right)`,
        buckets: buckets.map(b => [...b])
      });

      for (let i = 0; i < arr.length; i++) {
        const digitValue = Math.floor(arr[i] / Math.pow(10, digit)) % 10;
        buckets[digitValue].push(arr[i]);
        
        steps.push({
          type: 'distribute',
          array: [...arr],
          highlightedIndices: [i],
          description: `Placing ${arr[i]} in bucket ${digitValue} (digit: ${digitValue})`,
          buckets: buckets.map(b => [...b])
        });
      }

      let index = 0;
      for (let i = 0; i < 10; i++) {
        for (const num of buckets[i]) {
          arr[index] = num;
          steps.push({
            type: 'collect',
            array: [...arr],
            highlightedIndices: [index],
            description: `Collecting ${num} from bucket ${i} to position ${index}`,
            buckets: buckets.map(b => [...b])
          });
          index++;
        }
      }

      steps.push({
        type: 'pass-complete',
        array: [...arr],
        description: `Completed pass for digit position ${digit + 1}`
      });
    }

    steps.push({
      type: 'complete',
      array: [...arr],
      sorted: Array.from({ length: arr.length }, (_, i) => i),
      description: 'Array is now fully sorted!'
    });

    return steps;
  },

  // Counting Sort
  countingSort(array: number[]): VisualizationStep[] {
    const steps: VisualizationStep[] = [];
    const arr = [...array];
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    const range = max - min + 1;
    const count = new Array(range).fill(0);

    steps.push({
      type: 'count-start',
      array: [...arr],
      description: `Counting occurrences of each element (range: ${min} to ${max})`
    });

    for (let i = 0; i < arr.length; i++) {
      count[arr[i] - min]++;
      steps.push({
        type: 'count',
        array: [...arr],
        highlightedIndices: [i],
        description: `Counting element ${arr[i]}: count = ${count[arr[i] - min]}`
      });
    }

    for (let i = 1; i < range; i++) {
      count[i] += count[i - 1];
    }

    const output = new Array(arr.length);
    for (let i = arr.length - 1; i >= 0; i--) {
      const value = arr[i];
      const position = count[value - min] - 1;
      output[position] = value;
      count[value - min]--;
      
      steps.push({
        type: 'place',
        array: [...arr],
        auxiliary: [...output],
        highlightedIndices: [i],
        description: `Placing ${value} at position ${position} in output array`
      });
    }

    for (let i = 0; i < arr.length; i++) {
      arr[i] = output[i];
    }

    steps.push({
      type: 'complete',
      array: [...arr],
      sorted: Array.from({ length: arr.length }, (_, i) => i),
      description: 'Array is now fully sorted!'
    });

    return steps;
  },

  // Bucket Sort
  bucketSort(array: number[]): VisualizationStep[] {
    const steps: VisualizationStep[] = [];
    const arr = [...array];
    const n = arr.length;
    const bucketCount = Math.max(5, Math.floor(Math.sqrt(n)));
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    const bucketSize = Math.ceil((max - min + 1) / bucketCount);

    const buckets: number[][] = Array.from({ length: bucketCount }, () => []);

    steps.push({
      type: 'distribute-start',
      array: [...arr],
      description: `Distributing elements into ${bucketCount} buckets`,
      buckets: buckets.map(b => [...b])
    });

    for (let i = 0; i < n; i++) {
      const bucketIndex = Math.min(Math.floor((arr[i] - min) / bucketSize), bucketCount - 1);
      buckets[bucketIndex].push(arr[i]);
      
      steps.push({
        type: 'distribute',
        array: [...arr],
        highlightedIndices: [i],
        description: `Placing ${arr[i]} in bucket ${bucketIndex}`,
        buckets: buckets.map(b => [...b])
      });
    }

    let index = 0;
    for (let i = 0; i < bucketCount; i++) {
      if (buckets[i].length > 0) {
        buckets[i].sort((a, b) => a - b);
        
        steps.push({
          type: 'sort-bucket',
          array: [...arr],
          description: `Sorting bucket ${i} with ${buckets[i].length} elements`,
          buckets: buckets.map(b => [...b])
        });

        for (const num of buckets[i]) {
          arr[index] = num;
          steps.push({
            type: 'collect',
            array: [...arr],
            highlightedIndices: [index],
            description: `Collecting ${num} from bucket ${i} to position ${index}`,
            buckets: buckets.map(b => [...b])
          });
          index++;
        }
      }
    }

    steps.push({
      type: 'complete',
      array: [...arr],
      sorted: Array.from({ length: arr.length }, (_, i) => i),
      description: 'Array is now fully sorted!'
    });

    return steps;
  },

  // Shell Sort
  shellSort(array: number[]): VisualizationStep[] {
    const steps: VisualizationStep[] = [];
    const arr = [...array];
    const n = arr.length;
    let gap = Math.floor(n / 2);

    while (gap > 0) {
      steps.push({
        type: 'gap-start',
        array: [...arr],
        description: `Starting pass with gap size ${gap}`
      });

      for (let i = gap; i < n; i++) {
        const temp = arr[i];
        let j = i;

        steps.push({
          type: 'select',
          array: [...arr],
          highlightedIndices: [i],
          description: `Selecting element ${temp} at index ${i}`
        });

        while (j >= gap) {
          steps.push({
            type: 'compare',
            array: [...arr],
            comparing: [j - gap, j],
            description: `Comparing ${arr[j - gap]} with ${temp} (gap: ${gap})`
          });

          if (arr[j - gap] > temp) {
            arr[j] = arr[j - gap];
            steps.push({
              type: 'shift',
              array: [...arr],
              swapping: [j - gap, j],
              description: `Shifting ${arr[j]} to position ${j}`
            });
            j -= gap;
          } else {
            break;
          }
        }

        arr[j] = temp;
        steps.push({
          type: 'insert',
          array: [...arr],
          highlightedIndices: [j],
          description: `Placed ${temp} at position ${j}`
        });
      }

      gap = Math.floor(gap / 2);
    }

    steps.push({
      type: 'complete',
      array: [...arr],
      sorted: Array.from({ length: arr.length }, (_, i) => i),
      description: 'Array is now fully sorted!'
    });

    return steps;
  },

  // Cocktail Shaker Sort (Bidirectional Bubble Sort)
  cocktailSort(array: number[]): VisualizationStep[] {
    const steps: VisualizationStep[] = [];
    const arr = [...array];
    let swapped = true;
    let start = 0;
    let end = arr.length - 1;

    while (swapped) {
      swapped = false;

      // Forward pass
      for (let i = start; i < end; i++) {
        steps.push({
          type: 'compare',
          array: [...arr],
          comparing: [i, i + 1],
          description: `Forward pass: Comparing ${arr[i]} and ${arr[i + 1]}`
        });

        if (arr[i] > arr[i + 1]) {
          [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
          swapped = true;
          steps.push({
            type: 'swap',
            array: [...arr],
            swapping: [i, i + 1],
            description: `Swapping ${arr[i + 1]} and ${arr[i]}`
          });
        }
      }

      if (!swapped) break;
      end--;

      swapped = false;

      // Backward pass
      for (let i = end - 1; i >= start; i--) {
        steps.push({
          type: 'compare',
          array: [...arr],
          comparing: [i, i + 1],
          description: `Backward pass: Comparing ${arr[i]} and ${arr[i + 1]}`
        });

        if (arr[i] > arr[i + 1]) {
          [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
          swapped = true;
          steps.push({
            type: 'swap',
            array: [...arr],
            swapping: [i, i + 1],
            description: `Swapping ${arr[i + 1]} and ${arr[i]}`
          });
        }
      }

      start++;
    }

    steps.push({
      type: 'complete',
      array: [...arr],
      sorted: Array.from({ length: arr.length }, (_, i) => i),
      description: 'Array is now fully sorted!'
    });

    return steps;
  },

  // Comb Sort
  combSort(array: number[]): VisualizationStep[] {
    const steps: VisualizationStep[] = [];
    const arr = [...array];
    const n = arr.length;
    let gap = n;
    const shrink = 1.3;
    let swapped = true;

    while (gap > 1 || swapped) {
      gap = Math.floor(gap / shrink);
      if (gap < 1) gap = 1;

      swapped = false;

      steps.push({
        type: 'gap',
        array: [...arr],
        description: `Current gap: ${gap}`
      });

      for (let i = 0; i + gap < n; i++) {
        steps.push({
          type: 'compare',
          array: [...arr],
          comparing: [i, i + gap],
          description: `Comparing elements at distance ${gap}: ${arr[i]} and ${arr[i + gap]}`
        });

        if (arr[i] > arr[i + gap]) {
          [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];
          swapped = true;
          steps.push({
            type: 'swap',
            array: [...arr],
            swapping: [i, i + gap],
            description: `Swapping ${arr[i + gap]} and ${arr[i]}`
          });
        }
      }
    }

    steps.push({
      type: 'complete',
      array: [...arr],
      sorted: Array.from({ length: arr.length }, (_, i) => i),
      description: 'Array is now fully sorted!'
    });

    return steps;
  }
};
