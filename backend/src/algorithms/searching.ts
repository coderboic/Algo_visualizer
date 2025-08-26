export const searchingAlgorithms = {
  linearSearch(array: number[], target: number): any[] {
    const steps: any[] = [];
    
    for (let i = 0; i < array.length; i++) {
      steps.push({
        type: 'check',
        array: [...array],
        checking: i,
        target,
        description: `Checking if ${array[i]} equals ${target}`
      });
      
      if (array[i] === target) {
        steps.push({
          type: 'found',
          array: [...array],
          foundAt: i,
          target,
          description: `Found ${target} at index ${i}`
        });
        return steps;
      }
    }
    
    steps.push({
      type: 'not-found',
      array: [...array],
      target,
      description: `${target} not found in the array`
    });
    
    return steps;
  },

  binarySearch(array: number[], target: number): any[] {
    const steps: any[] = [];
    let left = 0;
    let right = array.length - 1;
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      
      steps.push({
        type: 'range',
        array: [...array],
        range: [left, right],
        mid,
        target,
        description: `Searching in range [${left}, ${right}], middle at ${mid}`
      });
      
      steps.push({
        type: 'check',
        array: [...array],
        checking: mid,
        target,
        range: [left, right],
        description: `Checking if ${array[mid]} equals ${target}`
      });
      
      if (array[mid] === target) {
        steps.push({
          type: 'found',
          array: [...array],
          foundAt: mid,
          target,
          description: `Found ${target} at index ${mid}`
        });
        return steps;
      }
      
      if (array[mid] < target) {
        left = mid + 1;
        steps.push({
          type: 'adjust',
          array: [...array],
          range: [left, right],
          target,
          description: `${array[mid]} < ${target}, searching right half`
        });
      } else {
        right = mid - 1;
        steps.push({
          type: 'adjust',
          array: [...array],
          range: [left, right],
          target,
          description: `${array[mid]} > ${target}, searching left half`
        });
      }
    }
    
    steps.push({
      type: 'not-found',
      array: [...array],
      target,
      description: `${target} not found in the array`
    });
    
    return steps;
  },

  jumpSearch(array: number[], target: number): any[] {
    const steps: any[] = [];
    const n = array.length;
    let step = Math.floor(Math.sqrt(n));
    let prev = 0;
    
    // Jump to find the block where element is present
    while (array[Math.min(step, n) - 1] < target) {
      steps.push({
        type: 'jump',
        array: [...array],
        jumping: [prev, Math.min(step, n) - 1],
        target,
        description: `Jumping from index ${prev} to ${Math.min(step, n) - 1}`
      });
      
      prev = step;
      step += Math.floor(Math.sqrt(n));
      
      if (prev >= n) {
        steps.push({
          type: 'not-found',
          array: [...array],
          target,
          description: `${target} not found in the array`
        });
        return steps;
      }
    }
    
    // Linear search in the identified block
    steps.push({
      type: 'block-found',
      array: [...array],
      range: [prev, Math.min(step, n)],
      target,
      description: `Target might be in block [${prev}, ${Math.min(step, n)}]`
    });
    
    while (array[prev] < target) {
      steps.push({
        type: 'check',
        array: [...array],
        checking: prev,
        target,
        description: `Checking if ${array[prev]} equals ${target}`
      });
      
      prev++;
      if (prev === Math.min(step, n)) {
        steps.push({
          type: 'not-found',
          array: [...array],
          target,
          description: `${target} not found in the array`
        });
        return steps;
      }
    }
    
    steps.push({
      type: 'check',
      array: [...array],
      checking: prev,
      target,
      description: `Checking if ${array[prev]} equals ${target}`
    });
    
    if (array[prev] === target) {
      steps.push({
        type: 'found',
        array: [...array],
        foundAt: prev,
        target,
        description: `Found ${target} at index ${prev}`
      });
    } else {
      steps.push({
        type: 'not-found',
        array: [...array],
        target,
        description: `${target} not found in the array`
      });
    }
    
    return steps;
  },

  interpolationSearch(array: number[], target: number): any[] {
    const steps: any[] = [];
    let low = 0;
    let high = array.length - 1;
    
    while (low <= high && target >= array[low] && target <= array[high]) {
      if (low === high) {
        steps.push({
          type: 'check',
          array: [...array],
          checking: low,
          target,
          description: `Checking if ${array[low]} equals ${target}`
        });
        
        if (array[low] === target) {
          steps.push({
            type: 'found',
            array: [...array],
            foundAt: low,
            target,
            description: `Found ${target} at index ${low}`
          });
        } else {
          steps.push({
            type: 'not-found',
            array: [...array],
            target,
            description: `${target} not found in the array`
          });
        }
        return steps;
      }
      
      // Calculate position using interpolation formula
      const pos = low + Math.floor(
        ((target - array[low]) * (high - low)) / 
        (array[high] - array[low])
      );
      
      steps.push({
        type: 'interpolate',
        array: [...array],
        range: [low, high],
        position: pos,
        target,
        description: `Interpolating position: checking index ${pos}`
      });
      
      steps.push({
        type: 'check',
        array: [...array],
        checking: pos,
        target,
        description: `Checking if ${array[pos]} equals ${target}`
      });
      
      if (array[pos] === target) {
        steps.push({
          type: 'found',
          array: [...array],
          foundAt: pos,
          target,
          description: `Found ${target} at index ${pos}`
        });
        return steps;
      }
      
      if (array[pos] < target) {
        low = pos + 1;
        steps.push({
          type: 'adjust',
          array: [...array],
          range: [low, high],
          target,
          description: `${array[pos]} < ${target}, searching upper part`
        });
      } else {
        high = pos - 1;
        steps.push({
          type: 'adjust',
          array: [...array],
          range: [low, high],
          target,
          description: `${array[pos]} > ${target}, searching lower part`
        });
      }
    }
    
    steps.push({
      type: 'not-found',
      array: [...array],
      target,
      description: `${target} not found in the array`
    });
    
    return steps;
  }
};