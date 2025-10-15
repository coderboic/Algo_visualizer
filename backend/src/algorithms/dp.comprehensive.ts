export interface DPStep {
  type: string;
  description: string;
  table?: any[][];
  currentCell?: [number, number];
  highlightedCells?: [number, number][];
  result?: any;
  sequence?: any[];
  choices?: string[];
}

export class DynamicProgrammingAlgorithms {
  // Fibonacci with Memoization
  static fibonacci(n: number): DPStep[] {
    const steps: DPStep[] = [];
    const memo: number[] = new Array(n + 1).fill(-1);
    memo[0] = 0;
    memo[1] = 1;

    steps.push({
      type: 'start',
      description: `Computing Fibonacci(${n}) using dynamic programming`,
      table: [[...memo]]
    });

    for (let i = 2; i <= n; i++) {
      memo[i] = memo[i - 1] + memo[i - 2];
      
      steps.push({
        type: 'compute',
        description: `F(${i}) = F(${i-1}) + F(${i-2}) = ${memo[i-1]} + ${memo[i-2]} = ${memo[i]}`,
        table: [[...memo]],
        currentCell: [0, i],
        highlightedCells: [[0, i - 1], [0, i - 2]]
      });
    }

    steps.push({
      type: 'complete',
      description: `Fibonacci(${n}) = ${memo[n]}`,
      table: [[...memo]],
      result: memo[n]
    });

    return steps;
  }

  // 0/1 Knapsack Problem
  static knapsack(weights: number[], values: number[], capacity: number): DPStep[] {
    const steps: DPStep[] = [];
    const n = weights.length;
    const dp: number[][] = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0));

    steps.push({
      type: 'start',
      description: `Solving 0/1 Knapsack: ${n} items, capacity ${capacity}`,
      table: dp.map(row => [...row])
    });

    for (let i = 1; i <= n; i++) {
      for (let w = 1; w <= capacity; w++) {
        if (weights[i - 1] <= w) {
          const include = values[i - 1] + dp[i - 1][w - weights[i - 1]];
          const exclude = dp[i - 1][w];
          dp[i][w] = Math.max(include, exclude);

          steps.push({
            type: 'compare',
            description: `Item ${i} (w:${weights[i-1]}, v:${values[i-1]}), capacity ${w}: ` +
                        `include=${include} vs exclude=${exclude} → ${dp[i][w]}`,
            table: dp.map(row => [...row]),
            currentCell: [i, w],
            highlightedCells: [[i - 1, w], [i - 1, w - weights[i - 1]]]
          });
        } else {
          dp[i][w] = dp[i - 1][w];
          
          steps.push({
            type: 'skip',
            description: `Item ${i} too heavy (${weights[i-1]} > ${w}), skip`,
            table: dp.map(row => [...row]),
            currentCell: [i, w],
            highlightedCells: [[i - 1, w]]
          });
        }
      }
    }

    // Backtrack to find items
    const items: number[] = [];
    let w = capacity;
    for (let i = n; i > 0 && w > 0; i--) {
      if (dp[i][w] !== dp[i - 1][w]) {
        items.push(i - 1);
        w -= weights[i - 1];
      }
    }

    steps.push({
      type: 'complete',
      description: `Maximum value: ${dp[n][capacity]}, Items selected: ${items.reverse()}`,
      table: dp.map(row => [...row]),
      result: dp[n][capacity],
      sequence: items
    });

    return steps;
  }

  // Longest Common Subsequence (LCS)
  static longestCommonSubsequence(str1: string, str2: string): DPStep[] {
    const steps: DPStep[] = [];
    const m = str1.length;
    const n = str2.length;
    const dp: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

    steps.push({
      type: 'start',
      description: `Finding LCS of "${str1}" and "${str2}"`,
      table: dp.map(row => [...row])
    });

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
          
          steps.push({
            type: 'match',
            description: `Characters match: '${str1[i-1]}' == '${str2[j-1]}', LCS length = ${dp[i][j]}`,
            table: dp.map(row => [...row]),
            currentCell: [i, j],
            highlightedCells: [[i - 1, j - 1]]
          });
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
          
          steps.push({
            type: 'no-match',
            description: `'${str1[i-1]}' ≠ '${str2[j-1]}', take max(${dp[i-1][j]}, ${dp[i][j-1]}) = ${dp[i][j]}`,
            table: dp.map(row => [...row]),
            currentCell: [i, j],
            highlightedCells: [[i - 1, j], [i, j - 1]]
          });
        }
      }
    }

    // Backtrack to find LCS
    let lcs = '';
    let i = m, j = n;
    while (i > 0 && j > 0) {
      if (str1[i - 1] === str2[j - 1]) {
        lcs = str1[i - 1] + lcs;
        i--;
        j--;
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }

    steps.push({
      type: 'complete',
      description: `LCS length: ${dp[m][n]}, LCS: "${lcs}"`,
      table: dp.map(row => [...row]),
      result: dp[m][n],
      sequence: lcs.split('')
    });

    return steps;
  }

  // Edit Distance (Levenshtein Distance)
  static editDistance(str1: string, str2: string): DPStep[] {
    const steps: DPStep[] = [];
    const m = str1.length;
    const n = str2.length;
    const dp: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

    // Initialize base cases
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    steps.push({
      type: 'start',
      description: `Computing edit distance between "${str1}" and "${str2}"`,
      table: dp.map(row => [...row])
    });

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
          
          steps.push({
            type: 'match',
            description: `'${str1[i-1]}' == '${str2[j-1]}', no operation needed, cost = ${dp[i][j]}`,
            table: dp.map(row => [...row]),
            currentCell: [i, j],
            highlightedCells: [[i - 1, j - 1]]
          });
        } else {
          const replace = dp[i - 1][j - 1] + 1;
          const insert = dp[i][j - 1] + 1;
          const deleteOp = dp[i - 1][j] + 1;
          dp[i][j] = Math.min(replace, insert, deleteOp);

          let operation = '';
          if (dp[i][j] === replace) operation = 'replace';
          else if (dp[i][j] === insert) operation = 'insert';
          else operation = 'delete';

          steps.push({
            type: 'edit',
            description: `'${str1[i-1]}' ≠ '${str2[j-1]}', ${operation} cost = ${dp[i][j]} ` +
                        `(replace:${replace}, insert:${insert}, delete:${deleteOp})`,
            table: dp.map(row => [...row]),
            currentCell: [i, j],
            highlightedCells: [[i - 1, j - 1], [i, j - 1], [i - 1, j]]
          });
        }
      }
    }

    steps.push({
      type: 'complete',
      description: `Minimum edit distance: ${dp[m][n]}`,
      table: dp.map(row => [...row]),
      result: dp[m][n]
    });

    return steps;
  }

  // Coin Change Problem
  static coinChange(coins: number[], amount: number): DPStep[] {
    const steps: DPStep[] = [];
    const dp: number[] = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;

    steps.push({
      type: 'start',
      description: `Finding minimum coins needed for amount ${amount} using coins [${coins.join(', ')}]`,
      table: [[...dp]]
    });

    for (let i = 1; i <= amount; i++) {
      for (const coin of coins) {
        if (coin <= i && dp[i - coin] !== Infinity) {
          const newCount = dp[i - coin] + 1;
          
          if (newCount < dp[i]) {
            dp[i] = newCount;
            
            steps.push({
              type: 'update',
              description: `Amount ${i}: using coin ${coin}, count = ${newCount} (${dp[i-coin]} + 1)`,
              table: [[...dp]],
              currentCell: [0, i],
              highlightedCells: [[0, i - coin]]
            });
          }
        }
      }

      if (dp[i] === Infinity) {
        steps.push({
          type: 'impossible',
          description: `Amount ${i} cannot be made with given coins`,
          table: [[...dp]],
          currentCell: [0, i]
        });
      }
    }

    steps.push({
      type: 'complete',
      description: dp[amount] === Infinity 
        ? `Amount ${amount} cannot be made with given coins`
        : `Minimum coins needed: ${dp[amount]}`,
      table: [[...dp]],
      result: dp[amount] === Infinity ? -1 : dp[amount]
    });

    return steps;
  }

  // Matrix Chain Multiplication
  static matrixChainMultiplication(dimensions: number[]): DPStep[] {
    const steps: DPStep[] = [];
    const n = dimensions.length - 1;
    const dp: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
    const split: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));

    steps.push({
      type: 'start',
      description: `Finding optimal matrix multiplication order for ${n} matrices`,
      table: dp.map(row => [...row])
    });

    for (let len = 2; len <= n; len++) {
      for (let i = 0; i < n - len + 1; i++) {
        const j = i + len - 1;
        dp[i][j] = Infinity;

        for (let k = i; k < j; k++) {
          const cost = dp[i][k] + dp[k + 1][j] + 
                      dimensions[i] * dimensions[k + 1] * dimensions[j + 1];

          if (cost < dp[i][j]) {
            dp[i][j] = cost;
            split[i][j] = k;

            steps.push({
              type: 'update',
              description: `M[${i}:${j}] split at ${k}: cost = ${cost}`,
              table: dp.map(row => [...row]),
              currentCell: [i, j],
              highlightedCells: [[i, k], [k + 1, j]]
            });
          }
        }
      }
    }

    steps.push({
      type: 'complete',
      description: `Minimum multiplication operations: ${dp[0][n-1]}`,
      table: dp.map(row => [...row]),
      result: dp[0][n - 1]
    });

    return steps;
  }

  // Longest Increasing Subsequence
  static longestIncreasingSubsequence(arr: number[]): DPStep[] {
    const steps: DPStep[] = [];
    const n = arr.length;
    const dp: number[] = new Array(n).fill(1);

    steps.push({
      type: 'start',
      description: `Finding longest increasing subsequence in [${arr.join(', ')}]`,
      table: [[...dp]]
    });

    for (let i = 1; i < n; i++) {
      for (let j = 0; j < i; j++) {
        if (arr[j] < arr[i]) {
          const newLength = dp[j] + 1;
          
          if (newLength > dp[i]) {
            dp[i] = newLength;
            
            steps.push({
              type: 'extend',
              description: `LIS ending at ${i}(${arr[i]}): extend from ${j}(${arr[j]}), length = ${dp[i]}`,
              table: [[...dp]],
              currentCell: [0, i],
              highlightedCells: [[0, j]]
            });
          }
        }
      }
    }

    const maxLength = Math.max(...dp);
    steps.push({
      type: 'complete',
      description: `Longest increasing subsequence length: ${maxLength}`,
      table: [[...dp]],
      result: maxLength
    });

    return steps;
  }

  // Rod Cutting Problem
  static rodCutting(prices: number[], length: number): DPStep[] {
    const steps: DPStep[] = [];
    const dp: number[] = new Array(length + 1).fill(0);

    steps.push({
      type: 'start',
      description: `Solving rod cutting problem: length ${length}, prices [${prices.join(', ')}]`,
      table: [[...dp]]
    });

    for (let i = 1; i <= length; i++) {
      let maxVal = -Infinity;
      
      for (let j = 0; j < i && j < prices.length; j++) {
        const val = prices[j] + dp[i - j - 1];
        
        if (val > maxVal) {
          maxVal = val;
          dp[i] = maxVal;
          
          steps.push({
            type: 'cut',
            description: `Length ${i}: cut at ${j+1}, value = ${prices[j]} + ${dp[i-j-1]} = ${val}`,
            table: [[...dp]],
            currentCell: [0, i],
            highlightedCells: [[0, i - j - 1]]
          });
        }
      }
    }

    steps.push({
      type: 'complete',
      description: `Maximum profit for length ${length}: ${dp[length]}`,
      table: [[...dp]],
      result: dp[length]
    });

    return steps;
  }

  // Subset Sum Problem
  static subsetSum(arr: number[], target: number): DPStep[] {
    const steps: DPStep[] = [];
    const n = arr.length;
    const dp: boolean[][] = Array(n + 1).fill(false).map(() => Array(target + 1).fill(false));

    // Base case: sum 0 is always possible
    for (let i = 0; i <= n; i++) {
      dp[i][0] = true;
    }

    steps.push({
      type: 'start',
      description: `Finding if subset with sum ${target} exists in [${arr.join(', ')}]`,
      table: dp.map(row => [...row])
    });

    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= target; j++) {
        if (arr[i - 1] <= j) {
          dp[i][j] = dp[i - 1][j] || dp[i - 1][j - arr[i - 1]];
          
          steps.push({
            type: 'decide',
            description: `Element ${arr[i-1]}, sum ${j}: ` +
                        `exclude=${dp[i-1][j]}, include=${dp[i-1][j-arr[i-1]]} → ${dp[i][j]}`,
            table: dp.map(row => [...row]),
            currentCell: [i, j],
            highlightedCells: [[i - 1, j], [i - 1, j - arr[i - 1]]]
          });
        } else {
          dp[i][j] = dp[i - 1][j];
          
          steps.push({
            type: 'skip',
            description: `Element ${arr[i-1]} > sum ${j}, skip`,
            table: dp.map(row => [...row]),
            currentCell: [i, j],
            highlightedCells: [[i - 1, j]]
          });
        }
      }
    }

    steps.push({
      type: 'complete',
      description: dp[n][target] 
        ? `Subset with sum ${target} exists!`
        : `No subset with sum ${target} found`,
      table: dp.map(row => [...row]),
      result: dp[n][target]
    });

    return steps;
  }

  // Palindrome Partitioning (Minimum Cuts)
  static palindromePartitioning(str: string): DPStep[] {
    const steps: DPStep[] = [];
    const n = str.length;
    const isPalin: boolean[][] = Array(n).fill(false).map(() => Array(n).fill(false));
    const cuts: number[] = new Array(n).fill(0);

    // Build palindrome table
    for (let i = 0; i < n; i++) {
      isPalin[i][i] = true;
    }

    steps.push({
      type: 'start',
      description: `Finding minimum cuts for palindrome partitioning of "${str}"`,
      table: [[...cuts]]
    });

    for (let len = 2; len <= n; len++) {
      for (let i = 0; i < n - len + 1; i++) {
        const j = i + len - 1;
        
        if (str[i] === str[j]) {
          isPalin[i][j] = (len === 2) || isPalin[i + 1][j - 1];
        }
      }
    }

    for (let i = 0; i < n; i++) {
      if (isPalin[0][i]) {
        cuts[i] = 0;
        steps.push({
          type: 'palindrome',
          description: `"${str.substring(0, i+1)}" is palindrome, 0 cuts needed`,
          table: [[...cuts]],
          currentCell: [0, i]
        });
      } else {
        cuts[i] = Infinity;
        for (let j = 0; j < i; j++) {
          if (isPalin[j + 1][i]) {
            cuts[i] = Math.min(cuts[i], cuts[j] + 1);
          }
        }
        
        steps.push({
          type: 'partition',
          description: `Minimum cuts for "${str.substring(0, i+1)}": ${cuts[i]}`,
          table: [[...cuts]],
          currentCell: [0, i]
        });
      }
    }

    steps.push({
      type: 'complete',
      description: `Minimum cuts needed: ${cuts[n-1]}`,
      table: [[...cuts]],
      result: cuts[n - 1]
    });

    return steps;
  }
}
