export interface SearchStep {
  type: string;
  array: number[];
  target: number;
  currentIndex?: number;
  comparing?: number[];
  found?: boolean;
  foundIndex?: number;
  range?: number[];
  description: string;
  highlightedIndices?: number[];
  jumpSize?: number;
  blockStart?: number;
  blockEnd?: number;
}

export const searchingAlgorithms = {
  // Linear Search
  linearSearch(array: number[], target: number): SearchStep[] {
    const steps: SearchStep[] = [];
    const arr = [...array];

    steps.push({
      type: 'start',
      array: [...arr],
      target,
      description: `Searching for ${target} using Linear Search`
    });

    for (let i = 0; i < arr.length; i++) {
      steps.push({
        type: 'compare',
        array: [...arr],
        target,
        currentIndex: i,
        comparing: [i],
        description: `Checking element at index ${i}: ${arr[i]}`
      });

      if (arr[i] === target) {
        steps.push({
          type: 'found',
          array: [...arr],
          target,
          found: true,
          foundIndex: i,
          highlightedIndices: [i],
          description: `Target ${target} found at index ${i}!`
        });
        return steps;
      }
    }

    steps.push({
      type: 'not-found',
      array: [...arr],
      target,
      found: false,
      description: `Target ${target} not found in the array`
    });

    return steps;
  },

  // Binary Search
  binarySearch(array: number[], target: number): SearchStep[] {
    const steps: SearchStep[] = [];
    const arr = [...array];
    let left = 0;
    let right = arr.length - 1;

    steps.push({
      type: 'start',
      array: [...arr],
      target,
      range: [left, right],
      description: `Searching for ${target} using Binary Search (array must be sorted)`
    });

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      
      steps.push({
        type: 'calculate-mid',
        array: [...arr],
        target,
        currentIndex: mid,
        range: [left, right],
        highlightedIndices: [mid],
        description: `Calculating middle index: ${mid}, value: ${arr[mid]}`
      });

      steps.push({
        type: 'compare',
        array: [...arr],
        target,
        currentIndex: mid,
        comparing: [mid],
        range: [left, right],
        description: `Comparing ${arr[mid]} with target ${target}`
      });

      if (arr[mid] === target) {
        steps.push({
          type: 'found',
          array: [...arr],
          target,
          found: true,
          foundIndex: mid,
          highlightedIndices: [mid],
          description: `Target ${target} found at index ${mid}!`
        });
        return steps;
      }

      if (arr[mid] < target) {
        steps.push({
          type: 'move-right',
          array: [...arr],
          target,
          range: [left, right],
          description: `${arr[mid]} < ${target}, searching in right half`
        });
        left = mid + 1;
      } else {
        steps.push({
          type: 'move-left',
          array: [...arr],
          target,
          range: [left, right],
          description: `${arr[mid]} > ${target}, searching in left half`
        });
        right = mid - 1;
      }
    }

    steps.push({
      type: 'not-found',
      array: [...arr],
      target,
      found: false,
      description: `Target ${target} not found in the array`
    });

    return steps;
  },

  // Jump Search
  jumpSearch(array: number[], target: number): SearchStep[] {
    const steps: SearchStep[] = [];
    const arr = [...array];
    const n = arr.length;
    const jumpSize = Math.floor(Math.sqrt(n));
    let step = jumpSize;
    let prev = 0;

    steps.push({
      type: 'start',
      array: [...arr],
      target,
      jumpSize,
      description: `Searching for ${target} using Jump Search (jump size: ${jumpSize})`
    });

    // Finding the block where element is present
    while (arr[Math.min(step, n) - 1] < target) {
      steps.push({
        type: 'jump',
        array: [...arr],
        target,
        currentIndex: Math.min(step, n) - 1,
        jumpSize,
        blockStart: prev,
        blockEnd: Math.min(step, n) - 1,
        highlightedIndices: [Math.min(step, n) - 1],
        description: `Jumping to index ${Math.min(step, n) - 1}, value: ${arr[Math.min(step, n) - 1]}`
      });

      prev = step;
      step += jumpSize;
      
      if (prev >= n) {
        steps.push({
          type: 'not-found',
          array: [...arr],
          target,
          found: false,
          description: `Target ${target} not found - exceeded array bounds`
        });
        return steps;
      }
    }

    steps.push({
      type: 'block-found',
      array: [...arr],
      target,
      blockStart: prev,
      blockEnd: Math.min(step, n) - 1,
      description: `Target might be in block [${prev}, ${Math.min(step, n) - 1}], performing linear search`
    });

    // Linear search in the identified block
    for (let i = prev; i < Math.min(step, n); i++) {
      steps.push({
        type: 'linear-search',
        array: [...arr],
        target,
        currentIndex: i,
        comparing: [i],
        blockStart: prev,
        blockEnd: Math.min(step, n) - 1,
        description: `Checking element at index ${i}: ${arr[i]}`
      });

      if (arr[i] === target) {
        steps.push({
          type: 'found',
          array: [...arr],
          target,
          found: true,
          foundIndex: i,
          highlightedIndices: [i],
          description: `Target ${target} found at index ${i}!`
        });
        return steps;
      }

      if (arr[i] > target) {
        break;
      }
    }

    steps.push({
      type: 'not-found',
      array: [...arr],
      target,
      found: false,
      description: `Target ${target} not found in the array`
    });

    return steps;
  },

  // Interpolation Search
  interpolationSearch(array: number[], target: number): SearchStep[] {
    const steps: SearchStep[] = [];
    const arr = [...array];
    let left = 0;
    let right = arr.length - 1;

    steps.push({
      type: 'start',
      array: [...arr],
      target,
      range: [left, right],
      description: `Searching for ${target} using Interpolation Search`
    });

    while (left <= right && target >= arr[left] && target <= arr[right]) {
      if (left === right) {
        steps.push({
          type: 'single-element',
          array: [...arr],
          target,
          currentIndex: left,
          comparing: [left],
          description: `Single element remaining at index ${left}`
        });

        if (arr[left] === target) {
          steps.push({
            type: 'found',
            array: [...arr],
            target,
            found: true,
            foundIndex: left,
            highlightedIndices: [left],
            description: `Target ${target} found at index ${left}!`
          });
          return steps;
        }
        break;
      }

      // Interpolation formula
      const pos = left + Math.floor(
        ((target - arr[left]) * (right - left)) / (arr[right] - arr[left])
      );

      steps.push({
        type: 'interpolate',
        array: [...arr],
        target,
        currentIndex: pos,
        range: [left, right],
        highlightedIndices: [pos],
        description: `Interpolated position: ${pos}, value: ${arr[pos]}`
      });

      steps.push({
        type: 'compare',
        array: [...arr],
        target,
        currentIndex: pos,
        comparing: [pos],
        range: [left, right],
        description: `Comparing ${arr[pos]} with target ${target}`
      });

      if (arr[pos] === target) {
        steps.push({
          type: 'found',
          array: [...arr],
          target,
          found: true,
          foundIndex: pos,
          highlightedIndices: [pos],
          description: `Target ${target} found at index ${pos}!`
        });
        return steps;
      }

      if (arr[pos] < target) {
        steps.push({
          type: 'move-right',
          array: [...arr],
          target,
          range: [left, right],
          description: `${arr[pos]} < ${target}, searching in right portion`
        });
        left = pos + 1;
      } else {
        steps.push({
          type: 'move-left',
          array: [...arr],
          target,
          range: [left, right],
          description: `${arr[pos]} > ${target}, searching in left portion`
        });
        right = pos - 1;
      }
    }

    steps.push({
      type: 'not-found',
      array: [...arr],
      target,
      found: false,
      description: `Target ${target} not found in the array`
    });

    return steps;
  },

  // Exponential Search
  exponentialSearch(array: number[], target: number): SearchStep[] {
    const steps: SearchStep[] = [];
    const arr = [...array];
    const n = arr.length;

    steps.push({
      type: 'start',
      array: [...arr],
      target,
      description: `Searching for ${target} using Exponential Search`
    });

    if (arr[0] === target) {
      steps.push({
        type: 'found',
        array: [...arr],
        target,
        found: true,
        foundIndex: 0,
        highlightedIndices: [0],
        description: `Target ${target} found at index 0!`
      });
      return steps;
    }

    // Find range for binary search
    let bound = 1;
    while (bound < n && arr[bound] < target) {
      steps.push({
        type: 'expand',
        array: [...arr],
        target,
        currentIndex: bound,
        highlightedIndices: [bound],
        description: `Checking bound at index ${bound}, value: ${arr[bound]}`
      });
      bound *= 2;
    }

    const left = Math.floor(bound / 2);
    const right = Math.min(bound, n - 1);

    steps.push({
      type: 'range-found',
      array: [...arr],
      target,
      range: [left, right],
      description: `Target might be in range [${left}, ${right}], performing binary search`
    });

    // Binary search in the found range
    return this.binarySearchInRange(arr, target, left, right, steps);
  },

  // Ternary Search
  ternarySearch(array: number[], target: number): SearchStep[] {
    const steps: SearchStep[] = [];
    const arr = [...array];
    let left = 0;
    let right = arr.length - 1;

    steps.push({
      type: 'start',
      array: [...arr],
      target,
      range: [left, right],
      description: `Searching for ${target} using Ternary Search`
    });

    while (left <= right) {
      const mid1 = left + Math.floor((right - left) / 3);
      const mid2 = right - Math.floor((right - left) / 3);

      steps.push({
        type: 'calculate-mids',
        array: [...arr],
        target,
        range: [left, right],
        highlightedIndices: [mid1, mid2],
        description: `Dividing into 3 parts: mid1=${mid1} (${arr[mid1]}), mid2=${mid2} (${arr[mid2]})`
      });

      if (arr[mid1] === target) {
        steps.push({
          type: 'found',
          array: [...arr],
          target,
          found: true,
          foundIndex: mid1,
          highlightedIndices: [mid1],
          description: `Target ${target} found at index ${mid1}!`
        });
        return steps;
      }

      if (arr[mid2] === target) {
        steps.push({
          type: 'found',
          array: [...arr],
          target,
          found: true,
          foundIndex: mid2,
          highlightedIndices: [mid2],
          description: `Target ${target} found at index ${mid2}!`
        });
        return steps;
      }

      if (target < arr[mid1]) {
        steps.push({
          type: 'search-left',
          array: [...arr],
          target,
          range: [left, mid1 - 1],
          description: `Target < ${arr[mid1]}, searching in left third`
        });
        right = mid1 - 1;
      } else if (target > arr[mid2]) {
        steps.push({
          type: 'search-right',
          array: [...arr],
          target,
          range: [mid2 + 1, right],
          description: `Target > ${arr[mid2]}, searching in right third`
        });
        left = mid2 + 1;
      } else {
        steps.push({
          type: 'search-middle',
          array: [...arr],
          target,
          range: [mid1 + 1, mid2 - 1],
          description: `${arr[mid1]} < Target < ${arr[mid2]}, searching in middle third`
        });
        left = mid1 + 1;
        right = mid2 - 1;
      }
    }

    steps.push({
      type: 'not-found',
      array: [...arr],
      target,
      found: false,
      description: `Target ${target} not found in the array`
    });

    return steps;
  },

  // Fibonacci Search
  fibonacciSearch(array: number[], target: number): SearchStep[] {
    const steps: SearchStep[] = [];
    const arr = [...array];
    const n = arr.length;

    steps.push({
      type: 'start',
      array: [...arr],
      target,
      description: `Searching for ${target} using Fibonacci Search`
    });

    // Initialize Fibonacci numbers
    let fibM2 = 0; // (m-2)'th Fibonacci number
    let fibM1 = 1; // (m-1)'th Fibonacci number
    let fibM = fibM2 + fibM1; // m'th Fibonacci number

    // Find smallest Fibonacci number >= n
    while (fibM < n) {
      fibM2 = fibM1;
      fibM1 = fibM;
      fibM = fibM2 + fibM1;
    }

    steps.push({
      type: 'fibonacci-init',
      array: [...arr],
      target,
      description: `Initialized Fibonacci numbers: fibM=${fibM}, fibM1=${fibM1}, fibM2=${fibM2}`
    });

    let offset = -1;

    while (fibM > 1) {
      const i = Math.min(offset + fibM2, n - 1);

      steps.push({
        type: 'check',
        array: [...arr],
        target,
        currentIndex: i,
        highlightedIndices: [i],
        description: `Checking index ${i}, value: ${arr[i]}`
      });

      if (arr[i] < target) {
        steps.push({
          type: 'move-right',
          array: [...arr],
          target,
          description: `${arr[i]} < ${target}, eliminating left portion`
        });
        fibM = fibM1;
        fibM1 = fibM2;
        fibM2 = fibM - fibM1;
        offset = i;
      } else if (arr[i] > target) {
        steps.push({
          type: 'move-left',
          array: [...arr],
          target,
          description: `${arr[i]} > ${target}, eliminating right portion`
        });
        fibM = fibM2;
        fibM1 = fibM1 - fibM2;
        fibM2 = fibM - fibM1;
      } else {
        steps.push({
          type: 'found',
          array: [...arr],
          target,
          found: true,
          foundIndex: i,
          highlightedIndices: [i],
          description: `Target ${target} found at index ${i}!`
        });
        return steps;
      }
    }

    // Check last element
    if (fibM1 && offset + 1 < n && arr[offset + 1] === target) {
      steps.push({
        type: 'found',
        array: [...arr],
        target,
        found: true,
        foundIndex: offset + 1,
        highlightedIndices: [offset + 1],
        description: `Target ${target} found at index ${offset + 1}!`
      });
      return steps;
    }

    steps.push({
      type: 'not-found',
      array: [...arr],
      target,
      found: false,
      description: `Target ${target} not found in the array`
    });

    return steps;
  },

  // Helper method for exponential search
  binarySearchInRange(
    arr: number[],
    target: number,
    left: number,
    right: number,
    steps: SearchStep[]
  ): SearchStep[] {
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      
      steps.push({
        type: 'binary-compare',
        array: [...arr],
        target,
        currentIndex: mid,
        range: [left, right],
        highlightedIndices: [mid],
        comparing: [mid],
        description: `Binary search: comparing ${arr[mid]} with ${target}`
      });

      if (arr[mid] === target) {
        steps.push({
          type: 'found',
          array: [...arr],
          target,
          found: true,
          foundIndex: mid,
          highlightedIndices: [mid],
          description: `Target ${target} found at index ${mid}!`
        });
        return steps;
      }

      if (arr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    steps.push({
      type: 'not-found',
      array: [...arr],
      target,
      found: false,
      description: `Target ${target} not found in the array`
    });

    return steps;
  }
};
