export const sortingAlgorithms = {
  bubbleSort(array: number[]): any[] {
    const steps: any[] = [];
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        steps.push({
          type: 'compare',
          array: [...arr],
          comparing: [j, j + 1],
          sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
          description: `Comparing ${arr[j]} and ${arr[j + 1]}`
        });

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          steps.push({
            type: 'swap',
            array: [...arr],
            swapping: [j, j + 1],
            sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
            description: `Swapping ${arr[j + 1]} and ${arr[j]}`
          });
        }
      }
      steps.push({
        type: 'sorted',
        array: [...arr],
        sorted: Array.from({ length: i + 1 }, (_, k) => n - 1 - k),
        description: `Element at position ${n - i - 1} is now sorted`
      });
    }

    steps.push({
      type: 'complete',
      array: [...arr],
      sorted: Array.from({ length: n }, (_, i) => i),
      description: 'Sorting complete!'
    });

    return steps;
  },

  quickSort(array: number[]): any[] {
    const steps: any[] = [];
    const arr = [...array];

    function partition(low: number, high: number): number {
      const pivot = arr[high];
      let i = low - 1;

      steps.push({
        type: 'pivot',
        array: [...arr],
        pivot: high,
        range: [low, high],
        description: `Choosing ${pivot} as pivot`
      });

      for (let j = low; j < high; j++) {
        steps.push({
          type: 'compare',
          array: [...arr],
          comparing: [j, high],
          range: [low, high],
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
              range: [low, high],
              description: `Swapping ${arr[j]} and ${arr[i]}`
            });
          }
        }
      }

      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      steps.push({
        type: 'swap',
        array: [...arr],
        swapping: [i + 1, high],
        range: [low, high],
        description: `Placing pivot at correct position`
      });

      return i + 1;
    }

    function quickSortRecursive(low: number, high: number) {
      if (low < high) {
        const pi = partition(low, high);
        quickSortRecursive(low, pi - 1);
        quickSortRecursive(pi + 1, high);
      }
    }

    quickSortRecursive(0, arr.length - 1);

    steps.push({
      type: 'complete',
      array: [...arr],
      sorted: Array.from({ length: arr.length }, (_, i) => i),
      description: 'Sorting complete!'
    });

    return steps;
  },

  mergeSort(array: number[]): any[] {
    const steps: any[] = [];
    const arr = [...array];

    function merge(left: number, mid: number, right: number) {
      const leftArr = arr.slice(left, mid + 1);
      const rightArr = arr.slice(mid + 1, right + 1);
      
      steps.push({
        type: 'split',
        array: [...arr],
        leftRange: [left, mid],
        rightRange: [mid + 1, right],
        description: `Splitting array into [${leftArr}] and [${rightArr}]`
      });

      let i = 0, j = 0, k = left;

      while (i < leftArr.length && j < rightArr.length) {
        steps.push({
          type: 'compare',
          array: [...arr],
          comparing: [left + i, mid + 1 + j],
          range: [left, right],
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
          merging: k - 1,
          range: [left, right],
          description: `Placing ${arr[k - 1]} at position ${k - 1}`
        });
      }

      while (i < leftArr.length) {
        arr[k] = leftArr[i];
        i++;
        k++;
      }

      while (j < rightArr.length) {
        arr[k] = rightArr[j];
        j++;
        k++;
      }

      steps.push({
        type: 'merged',
        array: [...arr],
        range: [left, right],
        description: `Merged subarray from ${left} to ${right}`
      });
    }

    function mergeSortRecursive(left: number, right: number) {
      if (left < right) {
        const mid = Math.floor((left + right) / 2);
        mergeSortRecursive(left, mid);
        mergeSortRecursive(mid + 1, right);
        merge(left, mid, right);
      }
    }

    mergeSortRecursive(0, arr.length - 1);

    steps.push({
      type: 'complete',
      array: [...arr],
      sorted: Array.from({ length: arr.length }, (_, i) => i),
      description: 'Sorting complete!'
    });

    return steps;
  },

  heapSort(array: number[]): any[] {
    const steps: any[] = [];
    const arr = [...array];
    const n = arr.length;

    function heapify(size: number, i: number) {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      if (left < size) {
        steps.push({
          type: 'compare',
          array: [...arr],
          comparing: [left, largest],
          heap: true,
          description: `Comparing ${arr[left]} and ${arr[largest]}`
        });
        if (arr[left] > arr[largest]) {
          largest = left;
        }
      }

      if (right < size) {
        steps.push({
          type: 'compare',
          array: [...arr],
          comparing: [right, largest],
          heap: true,
          description: `Comparing ${arr[right]} and ${arr[largest]}`
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
          heap: true,
          description: `Swapping ${arr[largest]} and ${arr[i]} to maintain heap property`
        });
        heapify(size, largest);
      }
    }

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(n, i);
    }

    // Extract elements from heap
    for (let i = n - 1; i > 0; i--) {
      [arr[0], arr[i]] = [arr[i], arr[0]];
      steps.push({
        type: 'swap',
        array: [...arr],
        swapping: [0, i],
        sorted: Array.from({ length: n - i }, (_, k) => n - 1 - k),
        description: `Moving ${arr[0]} to sorted position`
      });
      heapify(i, 0);
    }

    steps.push({
      type: 'complete',
      array: [...arr],
      sorted: Array.from({ length: n }, (_, i) => i),
      description: 'Sorting complete!'
    });

    return steps;
  }
};