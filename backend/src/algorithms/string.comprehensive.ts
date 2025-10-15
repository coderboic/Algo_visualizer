export interface StringStep {
  type: string;
  description: string;
  text: string;
  pattern: string;
  currentIndex?: number;
  patternIndex?: number;
  highlightedIndices?: number[];
  matches?: number[];
  table?: any[];
  windowStart?: number;
  windowEnd?: number;
}

export class StringAlgorithms {
  // Naive Pattern Matching
  static naiveSearch(text: string, pattern: string): StringStep[] {
    const steps: StringStep[] = [];
    const n = text.length;
    const m = pattern.length;
    const matches: number[] = [];

    steps.push({
      type: 'start',
      text,
      pattern,
      description: `Searching for pattern "${pattern}" in text "${text}"`,
      matches: []
    });

    for (let i = 0; i <= n - m; i++) {
      let j = 0;
      
      steps.push({
        type: 'start-match',
        text,
        pattern,
        currentIndex: i,
        matches: [...matches],
        description: `Starting comparison at position ${i}`
      });

      while (j < m && text[i + j] === pattern[j]) {
        steps.push({
          type: 'match-char',
          text,
          pattern,
          currentIndex: i + j,
          patternIndex: j,
          highlightedIndices: [i + j],
          matches: [...matches],
          description: `Character match: '${text[i+j]}' == '${pattern[j]}' at position ${i+j}`
        });
        j++;
      }

      if (j === m) {
        matches.push(i);
        steps.push({
          type: 'found',
          text,
          pattern,
          currentIndex: i,
          matches: [...matches],
          description: `Pattern found at position ${i}!`
        });
      } else if (j < m) {
        steps.push({
          type: 'mismatch',
          text,
          pattern,
          currentIndex: i + j,
          patternIndex: j,
          highlightedIndices: [i + j],
          matches: [...matches],
          description: `Mismatch: '${text[i+j]}' != '${pattern[j]}' at position ${i+j}`
        });
      }
    }

    steps.push({
      type: 'complete',
      text,
      pattern,
      matches: [...matches],
      description: `Search complete! Found ${matches.length} occurrence(s) at positions: ${matches.join(', ') || 'none'}`
    });

    return steps;
  }

  // Knuth-Morris-Pratt (KMP) Algorithm
  static kmpSearch(text: string, pattern: string): StringStep[] {
    const steps: StringStep[] = [];
    const n = text.length;
    const m = pattern.length;
    const matches: number[] = [];

    // Build LPS (Longest Proper Prefix which is also Suffix) array
    const lps = this.computeLPS(pattern, steps);

    steps.push({
      type: 'lps-complete',
      text,
      pattern,
      table: [...lps],
      description: `LPS array computed: [${lps.join(', ')}]`,
      matches: []
    });

    let i = 0; // text index
    let j = 0; // pattern index

    while (i < n) {
      steps.push({
        type: 'compare',
        text,
        pattern,
        currentIndex: i,
        patternIndex: j,
        highlightedIndices: [i],
        table: [...lps],
        matches: [...matches],
        description: `Comparing text[${i}]='${text[i]}' with pattern[${j}]='${pattern[j]}'`
      });

      if (text[i] === pattern[j]) {
        steps.push({
          type: 'match',
          text,
          pattern,
          currentIndex: i,
          patternIndex: j,
          highlightedIndices: [i],
          table: [...lps],
          matches: [...matches],
          description: `Match! Moving both pointers forward`
        });
        i++;
        j++;
      }

      if (j === m) {
        matches.push(i - j);
        steps.push({
          type: 'found',
          text,
          pattern,
          currentIndex: i - j,
          table: [...lps],
          matches: [...matches],
          description: `Pattern found at position ${i - j}!`
        });
        j = lps[j - 1];
      } else if (i < n && text[i] !== pattern[j]) {
        if (j !== 0) {
          steps.push({
            type: 'mismatch-shift',
            text,
            pattern,
            currentIndex: i,
            patternIndex: j,
            table: [...lps],
            matches: [...matches],
            description: `Mismatch! Using LPS, shift pattern to j=${lps[j-1]}`
          });
          j = lps[j - 1];
        } else {
          steps.push({
            type: 'mismatch-advance',
            text,
            pattern,
            currentIndex: i,
            patternIndex: j,
            table: [...lps],
            matches: [...matches],
            description: `Mismatch at start of pattern, advance text pointer`
          });
          i++;
        }
      }
    }

    steps.push({
      type: 'complete',
      text,
      pattern,
      table: [...lps],
      matches: [...matches],
      description: `KMP search complete! Found ${matches.length} occurrence(s) at: ${matches.join(', ') || 'none'}`
    });

    return steps;
  }

  private static computeLPS(pattern: string, steps: StringStep[]): number[] {
    const m = pattern.length;
    const lps: number[] = new Array(m).fill(0);
    let len = 0;
    let i = 1;

    steps.push({
      type: 'lps-start',
      text: '',
      pattern,
      table: [...lps],
      description: 'Computing LPS (Longest Proper Prefix which is also Suffix) array'
    });

    while (i < m) {
      if (pattern[i] === pattern[len]) {
        len++;
        lps[i] = len;
        steps.push({
          type: 'lps-match',
          text: '',
          pattern,
          currentIndex: i,
          patternIndex: len - 1,
          table: [...lps],
          description: `LPS[${i}] = ${len} (pattern[${i}]='${pattern[i]}' matches pattern[${len-1}])`
        });
        i++;
      } else {
        if (len !== 0) {
          len = lps[len - 1];
        } else {
          lps[i] = 0;
          steps.push({
            type: 'lps-no-match',
            text: '',
            pattern,
            currentIndex: i,
            table: [...lps],
            description: `LPS[${i}] = 0 (no prefix-suffix match)`
          });
          i++;
        }
      }
    }

    return lps;
  }

  // Rabin-Karp Algorithm
  static rabinKarpSearch(text: string, pattern: string): StringStep[] {
    const steps: StringStep[] = [];
    const n = text.length;
    const m = pattern.length;
    const matches: number[] = [];
    const prime = 101; // A prime number
    const d = 256; // Number of characters in alphabet

    steps.push({
      type: 'start',
      text,
      pattern,
      description: `Rabin-Karp search using rolling hash (prime=${prime})`,
      matches: []
    });

    // Calculate hash value of pattern
    let patternHash = 0;
    let textHash = 0;
    let h = 1;

    // h = d^(m-1) % prime
    for (let i = 0; i < m - 1; i++) {
      h = (h * d) % prime;
    }

    // Calculate initial hash values
    for (let i = 0; i < m; i++) {
      patternHash = (d * patternHash + pattern.charCodeAt(i)) % prime;
      textHash = (d * textHash + text.charCodeAt(i)) % prime;
    }

    steps.push({
      type: 'hash-init',
      text,
      pattern,
      windowStart: 0,
      windowEnd: m - 1,
      description: `Pattern hash: ${patternHash}, Initial window hash: ${textHash}`,
      matches: []
    });

    // Slide the pattern over text
    for (let i = 0; i <= n - m; i++) {
      steps.push({
        type: 'compare-hash',
        text,
        pattern,
        currentIndex: i,
        windowStart: i,
        windowEnd: i + m - 1,
        highlightedIndices: Array.from({length: m}, (_, k) => i + k),
        matches: [...matches],
        description: `Window [${i}:${i+m-1}] hash: ${textHash}, comparing with pattern hash: ${patternHash}`
      });

      // Check hash values
      if (patternHash === textHash) {
        // Hash match - verify character by character
        let match = true;
        for (let j = 0; j < m; j++) {
          if (text[i + j] !== pattern[j]) {
            match = false;
            steps.push({
              type: 'spurious-hit',
              text,
              pattern,
              currentIndex: i + j,
              highlightedIndices: [i + j],
              matches: [...matches],
              description: `Spurious hit! Hash matches but characters don't: '${text[i+j]}' != '${pattern[j]}'`
            });
            break;
          }
        }

        if (match) {
          matches.push(i);
          steps.push({
            type: 'found',
            text,
            pattern,
            currentIndex: i,
            matches: [...matches],
            description: `Pattern found at position ${i}!`
          });
        }
      }

      // Calculate hash for next window
      if (i < n - m) {
        textHash = (d * (textHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % prime;
        if (textHash < 0) textHash += prime;

        steps.push({
          type: 'roll-hash',
          text,
          pattern,
          windowStart: i + 1,
          windowEnd: i + m,
          highlightedIndices: Array.from({length: m}, (_, k) => i + 1 + k),
          matches: [...matches],
          description: `Rolling hash to next window, new hash: ${textHash}`
        });
      }
    }

    steps.push({
      type: 'complete',
      text,
      pattern,
      matches: [...matches],
      description: `Rabin-Karp complete! Found ${matches.length} occurrence(s) at: ${matches.join(', ') || 'none'}`
    });

    return steps;
  }

  // Boyer-Moore Algorithm
  static boyerMooreSearch(text: string, pattern: string): StringStep[] {
    const steps: StringStep[] = [];
    const n = text.length;
    const m = pattern.length;
    const matches: number[] = [];

    // Build bad character table
    const badChar = this.buildBadCharTable(pattern);

    steps.push({
      type: 'start',
      text,
      pattern,
      table: [...badChar],
      description: `Boyer-Moore search with bad character heuristic`,
      matches: []
    });

    let shift = 0;

    while (shift <= n - m) {
      let j = m - 1;

      steps.push({
        type: 'align',
        text,
        pattern,
        currentIndex: shift,
        windowStart: shift,
        windowEnd: shift + m - 1,
        highlightedIndices: Array.from({length: m}, (_, k) => shift + k),
        matches: [...matches],
        description: `Aligning pattern at position ${shift}`
      });

      // Match from right to left
      while (j >= 0 && pattern[j] === text[shift + j]) {
        steps.push({
          type: 'match',
          text,
          pattern,
          currentIndex: shift + j,
          patternIndex: j,
          highlightedIndices: [shift + j],
          matches: [...matches],
          description: `Match: text[${shift+j}]='${text[shift+j]}' == pattern[${j}]='${pattern[j]}'`
        });
        j--;
      }

      if (j < 0) {
        matches.push(shift);
        steps.push({
          type: 'found',
          text,
          pattern,
          currentIndex: shift,
          matches: [...matches],
          description: `Pattern found at position ${shift}!`
        });
        shift += (shift + m < n) ? m - badChar[text.charCodeAt(shift + m)] : 1;
      } else {
        const badCharShift = Math.max(1, j - badChar[text.charCodeAt(shift + j)]);
        steps.push({
          type: 'mismatch',
          text,
          pattern,
          currentIndex: shift + j,
          patternIndex: j,
          highlightedIndices: [shift + j],
          matches: [...matches],
          description: `Mismatch at text[${shift+j}]='${text[shift+j]}', shifting by ${badCharShift}`
        });
        shift += badCharShift;
      }
    }

    steps.push({
      type: 'complete',
      text,
      pattern,
      matches: [...matches],
      description: `Boyer-Moore complete! Found ${matches.length} occurrence(s) at: ${matches.join(', ') || 'none'}`
    });

    return steps;
  }

  private static buildBadCharTable(pattern: string): number[] {
    const m = pattern.length;
    const badChar: number[] = new Array(256).fill(-1);

    for (let i = 0; i < m; i++) {
      badChar[pattern.charCodeAt(i)] = i;
    }

    return badChar;
  }

  // Z Algorithm
  static zAlgorithm(text: string, pattern: string): StringStep[] {
    const steps: StringStep[] = [];
    const concat = pattern + '$' + text;
    const n = concat.length;
    const z: number[] = new Array(n).fill(0);
    const matches: number[] = [];

    steps.push({
      type: 'start',
      text,
      pattern,
      description: `Z Algorithm: concatenated string "${concat}"`,
      table: [...z],
      matches: []
    });

    let left = 0, right = 0;

    for (let i = 1; i < n; i++) {
      if (i > right) {
        left = right = i;
        while (right < n && concat[right - left] === concat[right]) {
          right++;
        }
        z[i] = right - left;
        right--;

        steps.push({
          type: 'compute-z',
          text,
          pattern,
          currentIndex: i,
          table: [...z],
          matches: [...matches],
          description: `Z[${i}] = ${z[i]} (computed directly)`
        });
      } else {
        const k = i - left;
        if (z[k] < right - i + 1) {
          z[i] = z[k];
          steps.push({
            type: 'copy-z',
            text,
            pattern,
            currentIndex: i,
            table: [...z],
            matches: [...matches],
            description: `Z[${i}] = ${z[i]} (copied from Z[${k}])`
          });
        } else {
          left = i;
          while (right < n && concat[right - left] === concat[right]) {
            right++;
          }
          z[i] = right - left;
          right--;
          steps.push({
            type: 'extend-z',
            text,
            pattern,
            currentIndex: i,
            table: [...z],
            matches: [...matches],
            description: `Z[${i}] = ${z[i]} (extended from previous Z-box)`
          });
        }
      }

      // Check if pattern is found
      if (z[i] === pattern.length) {
        const pos = i - pattern.length - 1;
        matches.push(pos);
        steps.push({
          type: 'found',
          text,
          pattern,
          currentIndex: pos,
          table: [...z],
          matches: [...matches],
          description: `Pattern found at position ${pos}!`
        });
      }
    }

    steps.push({
      type: 'complete',
      text,
      pattern,
      table: [...z],
      matches: [...matches],
      description: `Z Algorithm complete! Found ${matches.length} occurrence(s) at: ${matches.join(', ') || 'none'}`
    });

    return steps;
  }

  // Longest Palindromic Substring (Manacher's Algorithm)
  static manacherAlgorithm(str: string): StringStep[] {
    const steps: StringStep[] = [];
    
    // Transform string: "abc" -> "^#a#b#c#$"
    const transformed = '^#' + str.split('').join('#') + '#$';
    const n = transformed.length;
    const p: number[] = new Array(n).fill(0);
    let center = 0, right = 0;

    steps.push({
      type: 'start',
      text: str,
      pattern: transformed,
      description: `Finding longest palindromic substring in "${str}"`,
      table: [...p]
    });

    for (let i = 1; i < n - 1; i++) {
      const mirror = 2 * center - i;

      if (i < right) {
        p[i] = Math.min(right - i, p[mirror]);
      }

      // Expand around center i
      while (transformed[i + 1 + p[i]] === transformed[i - 1 - p[i]]) {
        p[i]++;
      }

      steps.push({
        type: 'expand',
        text: str,
        pattern: transformed,
        currentIndex: i,
        table: [...p],
        description: `P[${i}] = ${p[i]} (palindrome radius at position ${i})`
      });

      // Update center and right boundary
      if (i + p[i] > right) {
        center = i;
        right = i + p[i];

        steps.push({
          type: 'update-center',
          text: str,
          pattern: transformed,
          currentIndex: center,
          table: [...p],
          description: `Updated center to ${center}, right boundary to ${right}`
        });
      }
    }

    // Find longest palindrome
    let maxLen = 0;
    let centerIndex = 0;
    for (let i = 1; i < n - 1; i++) {
      if (p[i] > maxLen) {
        maxLen = p[i];
        centerIndex = i;
      }
    }

    const start = (centerIndex - maxLen) / 2;
    const longestPalindrome = str.substring(start, start + maxLen);

    steps.push({
      type: 'complete',
      text: str,
      pattern: transformed,
      table: [...p],
      description: `Longest palindromic substring: "${longestPalindrome}" (length ${maxLen})`
    });

    return steps;
  }

  // Aho-Corasick Algorithm (Multi-pattern matching)
  static ahoCorasick(text: string, patterns: string[]): StringStep[] {
    const steps: StringStep[] = [];
    const matches: Map<string, number[]> = new Map();

    steps.push({
      type: 'start',
      text,
      pattern: patterns.join(', '),
      description: `Aho-Corasick: searching for patterns [${patterns.join(', ')}] in "${text}"`,
      matches: []
    });

    // For simplicity, we'll use multiple KMP searches
    // A full Aho-Corasick implementation would use a trie with failure links
    for (const pattern of patterns) {
      const patternMatches: number[] = [];
      const m = pattern.length;
      const n = text.length;

      for (let i = 0; i <= n - m; i++) {
        let match = true;
        for (let j = 0; j < m; j++) {
          if (text[i + j] !== pattern[j]) {
            match = false;
            break;
          }
        }

        if (match) {
          patternMatches.push(i);
          steps.push({
            type: 'found',
            text,
            pattern,
            currentIndex: i,
            matches: patternMatches,
            description: `Pattern "${pattern}" found at position ${i}`
          });
        }
      }

      matches.set(pattern, patternMatches);
    }

    const totalMatches = Array.from(matches.values()).flat();
    steps.push({
      type: 'complete',
      text,
      pattern: patterns.join(', '),
      matches: totalMatches,
      description: `Found total ${totalMatches.length} occurrence(s) across all patterns`
    });

    return steps;
  }
}
