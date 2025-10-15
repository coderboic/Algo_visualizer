export interface GraphNode {
  id: string;
  x: number;
  y: number;
  visited?: boolean;
  distance?: number | null;
  parent?: string | null;
  inQueue?: boolean;
  processing?: boolean;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight: number;
  highlighted?: boolean;
  selected?: boolean;
  inMST?: boolean;
}

export interface GraphStep {
  type: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  description: string;
  currentNode?: string;
  queue?: string[];
  stack?: string[];
  distances?: Record<string, number | null>;
  path?: string[];
  visited?: string[];
  mstEdges?: GraphEdge[];
  mstCost?: number;
}

export class GraphAlgorithms {
  // Breadth-First Search (BFS)
  static bfs(
    nodes: GraphNode[],
    edges: GraphEdge[],
    startNode: string
  ): GraphStep[] {
    const steps: GraphStep[] = [];
    const visited = new Set<string>();
    const queue: string[] = [startNode];
    const adjacencyList = GraphAlgorithms.buildAdjacencyList(nodes, edges);

    steps.push({
      type: 'start',
      nodes: nodes.map(n => ({ ...n, visited: n.id === startNode, inQueue: n.id === startNode })),
      edges: [...edges],
      queue: [...queue],
      visited: Array.from(visited),
      description: `Starting BFS from node ${startNode}`
    });

    while (queue.length > 0) {
      const current = queue.shift()!;
      visited.add(current);

      steps.push({
        type: 'visit',
        nodes: nodes.map(n => ({
          ...n,
          visited: visited.has(n.id),
          processing: n.id === current,
          inQueue: queue.includes(n.id)
        })),
        edges: [...edges],
        currentNode: current,
        queue: [...queue],
        visited: Array.from(visited),
        description: `Visiting node ${current}`
      });

      const neighbors = adjacencyList.get(current) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor) && !queue.includes(neighbor)) {
          queue.push(neighbor);
          
          steps.push({
            type: 'enqueue',
            nodes: nodes.map(n => ({
              ...n,
              visited: visited.has(n.id),
              processing: n.id === current,
              inQueue: queue.includes(n.id)
            })),
            edges: edges.map(e => ({
              ...e,
              highlighted: (e.source === current && e.target === neighbor) ||
                          (e.target === current && e.source === neighbor)
            })),
            currentNode: current,
            queue: [...queue],
            visited: Array.from(visited),
            description: `Adding neighbor ${neighbor} to queue`
          });
        }
      }
    }

    steps.push({
      type: 'complete',
      nodes: nodes.map(n => ({ ...n, visited: visited.has(n.id) })),
      edges: [...edges],
      visited: Array.from(visited),
      description: 'BFS traversal complete!'
    });

    return steps;
  }

  // Depth-First Search (DFS)
  static dfs(
    nodes: GraphNode[],
    edges: GraphEdge[],
    startNode: string
  ): GraphStep[] {
    const steps: GraphStep[] = [];
    const visited = new Set<string>();
    const stack: string[] = [startNode];
    const adjacencyList = GraphAlgorithms.buildAdjacencyList(nodes, edges);

    steps.push({
      type: 'start',
      nodes: nodes.map(n => ({ ...n })),
      edges: [...edges],
      stack: [...stack],
      visited: Array.from(visited),
      description: `Starting DFS from node ${startNode}`
    });

    while (stack.length > 0) {
      const current = stack.pop()!;
      
      if (visited.has(current)) continue;
      
      visited.add(current);

      steps.push({
        type: 'visit',
        nodes: nodes.map(n => ({
          ...n,
          visited: visited.has(n.id),
          processing: n.id === current
        })),
        edges: [...edges],
        currentNode: current,
        stack: [...stack],
        visited: Array.from(visited),
        description: `Visiting node ${current}`
      });

      const neighbors = adjacencyList.get(current) || [];
      for (let i = neighbors.length - 1; i >= 0; i--) {
        const neighbor = neighbors[i];
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
          
          steps.push({
            type: 'push',
            nodes: nodes.map(n => ({
              ...n,
              visited: visited.has(n.id),
              processing: n.id === current
            })),
            edges: edges.map(e => ({
              ...e,
              highlighted: (e.source === current && e.target === neighbor) ||
                          (e.target === current && e.source === neighbor)
            })),
            currentNode: current,
            stack: [...stack],
            visited: Array.from(visited),
            description: `Pushing neighbor ${neighbor} to stack`
          });
        }
      }
    }

    steps.push({
      type: 'complete',
      nodes: nodes.map(n => ({ ...n, visited: visited.has(n.id) })),
      edges: [...edges],
      visited: Array.from(visited),
      description: 'DFS traversal complete!'
    });

    return steps;
  }

  // Dijkstra's Shortest Path Algorithm
  static dijkstra(
    nodes: GraphNode[],
    edges: GraphEdge[],
    startNode: string
  ): GraphStep[] {
    const steps: GraphStep[] = [];
    const distances: Record<string, number> = {};
    const previous: Record<string, string | null> = {};
    const unvisited = new Set<string>();

    // Initialize distances
    nodes.forEach(node => {
      distances[node.id] = node.id === startNode ? 0 : Infinity;
      previous[node.id] = null;
      unvisited.add(node.id);
    });

    steps.push({
      type: 'start',
      nodes: nodes.map(n => ({ 
        ...n, 
        distance: distances[n.id] === Infinity ? null : distances[n.id] 
      })),
      edges: [...edges],
      distances: Object.fromEntries(
        Object.entries(distances).map(([k, v]) => [k, v === Infinity ? null : v])
      ),
      description: `Starting Dijkstra's algorithm from node ${startNode}`
    });

    while (unvisited.size > 0) {
      // Find node with minimum distance
      let current: string | null = null;
      let minDist = Infinity;
      
      unvisited.forEach(node => {
        if (distances[node] < minDist) {
          minDist = distances[node];
          current = node;
        }
      });

      if (current === null || distances[current] === Infinity) break;

      unvisited.delete(current);

      steps.push({
        type: 'visit',
        nodes: nodes.map(n => ({
          ...n,
          distance: distances[n.id] === Infinity ? null : distances[n.id],
          visited: !unvisited.has(n.id),
          processing: n.id === current
        })),
        edges: [...edges],
        currentNode: current,
        distances: Object.fromEntries(
          Object.entries(distances).map(([k, v]) => [k, v === Infinity ? null : v])
        ),
        description: `Processing node ${current} with distance ${distances[current]}`
      });

      // Check all neighbors
      const neighbors = GraphAlgorithms.getNeighborsWithWeights(edges, current);
      
      for (const [neighbor, weight] of neighbors) {
        if (!unvisited.has(neighbor)) continue;

        const alt = distances[current] + weight;

        steps.push({
          type: 'check-neighbor',
          nodes: nodes.map(n => ({
            ...n,
            distance: distances[n.id] === Infinity ? null : distances[n.id],
            visited: !unvisited.has(n.id),
            processing: n.id === current || n.id === neighbor
          })),
          edges: edges.map(e => ({
            ...e,
            highlighted: (e.source === current && e.target === neighbor) ||
                        (e.target === current && e.source === neighbor)
          })),
          currentNode: current,
          distances: Object.fromEntries(
            Object.entries(distances).map(([k, v]) => [k, v === Infinity ? null : v])
          ),
          description: `Checking path to ${neighbor}: ${distances[current]} + ${weight} = ${alt} vs current ${distances[neighbor] === Infinity ? '∞' : distances[neighbor]}`
        });

        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = current;

          steps.push({
            type: 'update-distance',
            nodes: nodes.map(n => ({
              ...n,
              distance: distances[n.id] === Infinity ? null : distances[n.id],
              visited: !unvisited.has(n.id),
              parent: previous[n.id]
            })),
            edges: edges.map(e => ({
              ...e,
              selected: (previous[e.target] === e.source || previous[e.source] === e.target)
            })),
            distances: Object.fromEntries(
              Object.entries(distances).map(([k, v]) => [k, v === Infinity ? null : v])
            ),
            description: `Updated distance to ${neighbor}: ${alt}`
          });
        }
      }
    }

    steps.push({
      type: 'complete',
      nodes: nodes.map(n => ({
        ...n,
        distance: distances[n.id] === Infinity ? null : distances[n.id],
        visited: true,
        parent: previous[n.id]
      })),
      edges: edges.map(e => ({
        ...e,
        selected: previous[e.target] === e.source || previous[e.source] === e.target
      })),
      distances: Object.fromEntries(
        Object.entries(distances).map(([k, v]) => [k, v === Infinity ? null : v])
      ),
      description: "Dijkstra's algorithm complete!"
    });

    return steps;
  }

  // Bellman-Ford Algorithm
  static bellmanFord(
    nodes: GraphNode[],
    edges: GraphEdge[],
    startNode: string
  ): GraphStep[] {
    const steps: GraphStep[] = [];
    const distances: Record<string, number> = {};
    const previous: Record<string, string | null> = {};

    // Initialize distances
    nodes.forEach(node => {
      distances[node.id] = node.id === startNode ? 0 : Infinity;
      previous[node.id] = null;
    });

    steps.push({
      type: 'start',
      nodes: nodes.map(n => ({ ...n, distance: distances[n.id] })),
      edges: [...edges],
      distances: { ...distances },
      description: `Starting Bellman-Ford algorithm from node ${startNode}`
    });

    // Relax edges V-1 times
    for (let i = 0; i < nodes.length - 1; i++) {
      steps.push({
        type: 'iteration',
        nodes: nodes.map(n => ({ ...n, distance: distances[n.id] })),
        edges: [...edges],
        distances: { ...distances },
        description: `Iteration ${i + 1} of ${nodes.length - 1}`
      });

      for (const edge of edges) {
        const { source, target, weight } = edge;
        
        if (distances[source] !== Infinity) {
          const alt = distances[source] + weight;
          
          steps.push({
            type: 'check-edge',
            nodes: nodes.map(n => ({ ...n, distance: distances[n.id] })),
            edges: edges.map(e => ({ ...e, highlighted: e === edge })),
            distances: { ...distances },
            description: `Checking edge ${source} → ${target}: ${distances[source]} + ${weight} = ${alt} vs ${distances[target]}`
          });

          if (alt < distances[target]) {
            distances[target] = alt;
            previous[target] = source;

            steps.push({
              type: 'relax',
              nodes: nodes.map(n => ({ ...n, distance: distances[n.id] })),
              edges: edges.map(e => ({ ...e, highlighted: e === edge })),
              distances: { ...distances },
              description: `Relaxed edge: updated distance to ${target} = ${alt}`
            });
          }
        }
      }
    }

    // Check for negative cycles
    let hasNegativeCycle = false;
    for (const edge of edges) {
      const { source, target, weight } = edge;
      if (distances[source] !== Infinity && distances[source] + weight < distances[target]) {
        hasNegativeCycle = true;
        steps.push({
          type: 'negative-cycle',
          nodes: nodes.map(n => ({ ...n, distance: distances[n.id] })),
          edges: edges.map(e => ({ ...e, highlighted: e === edge })),
          distances: { ...distances },
          description: `Negative cycle detected at edge ${source} → ${target}!`
        });
        break;
      }
    }

    if (!hasNegativeCycle) {
      steps.push({
        type: 'complete',
        nodes: nodes.map(n => ({ ...n, distance: distances[n.id] })),
        edges: [...edges],
        distances: { ...distances },
        description: 'Bellman-Ford algorithm complete! No negative cycles found.'
      });
    }

    return steps;
  }

  // Kruskal's Minimum Spanning Tree
  static kruskal(nodes: GraphNode[], edges: GraphEdge[]): GraphStep[] {
    const steps: GraphStep[] = [];
    const parent: Record<string, string> = {};
    const rank: Record<string, number> = {};
    const mstEdges: GraphEdge[] = [];
    let mstCost = 0;

    // Initialize disjoint sets
    nodes.forEach(node => {
      parent[node.id] = node.id;
      rank[node.id] = 0;
    });

    // Sort edges by weight
    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);

    steps.push({
      type: 'start',
      nodes: [...nodes],
      edges: [...edges],
      description: "Starting Kruskal's algorithm - edges sorted by weight"
    });

    const find = (node: string): string => {
      if (parent[node] !== node) {
        parent[node] = find(parent[node]);
      }
      return parent[node];
    };

    const union = (node1: string, node2: string): boolean => {
      const root1 = find(node1);
      const root2 = find(node2);

      if (root1 === root2) return false;

      if (rank[root1] < rank[root2]) {
        parent[root1] = root2;
      } else if (rank[root1] > rank[root2]) {
        parent[root2] = root1;
      } else {
        parent[root2] = root1;
        rank[root1]++;
      }
      return true;
    };

    for (const edge of sortedEdges) {
      steps.push({
        type: 'check-edge',
        nodes: [...nodes],
        edges: edges.map(e => ({
          ...e,
          highlighted: e === edge,
          inMST: mstEdges.includes(e)
        })),
        mstEdges: [...mstEdges],
        mstCost,
        description: `Checking edge ${edge.source} - ${edge.target} with weight ${edge.weight}`
      });

      if (union(edge.source, edge.target)) {
        mstEdges.push(edge);
        mstCost += edge.weight;

        steps.push({
          type: 'add-edge',
          nodes: [...nodes],
          edges: edges.map(e => ({
            ...e,
            highlighted: e === edge,
            inMST: mstEdges.includes(e)
          })),
          mstEdges: [...mstEdges],
          mstCost,
          description: `Added edge ${edge.source} - ${edge.target} to MST (total cost: ${mstCost})`
        });
      } else {
        steps.push({
          type: 'skip-edge',
          nodes: [...nodes],
          edges: edges.map(e => ({
            ...e,
            highlighted: e === edge,
            inMST: mstEdges.includes(e)
          })),
          mstEdges: [...mstEdges],
          mstCost,
          description: `Skipped edge ${edge.source} - ${edge.target} (would create cycle)`
        });
      }

      if (mstEdges.length === nodes.length - 1) break;
    }

    steps.push({
      type: 'complete',
      nodes: [...nodes],
      edges: edges.map(e => ({ ...e, inMST: mstEdges.includes(e) })),
      mstEdges: [...mstEdges],
      mstCost,
      description: `Kruskal's algorithm complete! MST cost: ${mstCost}`
    });

    return steps;
  }

  // Prim's Minimum Spanning Tree
  static prim(nodes: GraphNode[], edges: GraphEdge[], startNode: string): GraphStep[] {
    const steps: GraphStep[] = [];
    const inMST = new Set<string>();
    const mstEdges: GraphEdge[] = [];
    let mstCost = 0;

    inMST.add(startNode);

    steps.push({
      type: 'start',
      nodes: nodes.map(n => ({ ...n, visited: n.id === startNode })),
      edges: [...edges],
      mstEdges: [],
      mstCost: 0,
      description: `Starting Prim's algorithm from node ${startNode}`
    });

    while (inMST.size < nodes.length) {
      let minEdge: GraphEdge | null = null;
      let minWeight = Infinity;

      // Find minimum weight edge connecting MST to non-MST node
      for (const edge of edges) {
        const sourceInMST = inMST.has(edge.source);
        const targetInMST = inMST.has(edge.target);

        if (sourceInMST !== targetInMST && edge.weight < minWeight) {
          minWeight = edge.weight;
          minEdge = edge;
        }
      }

      if (!minEdge) break;

      const newNode = inMST.has(minEdge.source) ? minEdge.target : minEdge.source;
      inMST.add(newNode);
      mstEdges.push(minEdge);
      mstCost += minEdge.weight;

      steps.push({
        type: 'add-edge',
        nodes: nodes.map(n => ({ ...n, visited: inMST.has(n.id) })),
        edges: edges.map(e => ({
          ...e,
          highlighted: e === minEdge,
          inMST: mstEdges.includes(e)
        })),
        mstEdges: [...mstEdges],
        mstCost,
        description: `Added edge ${minEdge.source} - ${minEdge.target} (weight: ${minEdge.weight}, total: ${mstCost})`
      });
    }

    steps.push({
      type: 'complete',
      nodes: nodes.map(n => ({ ...n, visited: inMST.has(n.id) })),
      edges: edges.map(e => ({ ...e, inMST: mstEdges.includes(e) })),
      mstEdges,
      mstCost,
      description: `Prim's algorithm complete! MST cost: ${mstCost}`
    });

    return steps;
  }

  // Floyd-Warshall All-Pairs Shortest Path
  static floydWarshall(nodes: GraphNode[], edges: GraphEdge[]): GraphStep[] {
    const steps: GraphStep[] = [];
    const n = nodes.length;
    const dist: number[][] = Array(n).fill(0).map(() => Array(n).fill(Infinity));
    const nodeIndexMap = new Map<string, number>();
    
    nodes.forEach((node, i) => {
      nodeIndexMap.set(node.id, i);
      dist[i][i] = 0;
    });

    // Initialize distances from edges
    edges.forEach(edge => {
      const u = nodeIndexMap.get(edge.source)!;
      const v = nodeIndexMap.get(edge.target)!;
      dist[u][v] = edge.weight;
    });

    steps.push({
      type: 'start',
      nodes: [...nodes],
      edges: [...edges],
      description: 'Starting Floyd-Warshall algorithm - finding all-pairs shortest paths'
    });

    // Floyd-Warshall algorithm
    for (let k = 0; k < n; k++) {
      steps.push({
        type: 'iteration',
        nodes: nodes.map((n, i) => ({ ...n, processing: i === k })),
        edges: [...edges],
        description: `Using node ${nodes[k].id} as intermediate node`
      });

      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
            
            steps.push({
              type: 'update',
              nodes: nodes.map((n, idx) => ({
                ...n,
                processing: idx === i || idx === j || idx === k
              })),
              edges: [...edges],
              description: `Updated distance ${nodes[i].id} → ${nodes[j].id} = ${dist[i][j]} via ${nodes[k].id}`
            });
          }
        }
      }
    }

    steps.push({
      type: 'complete',
      nodes: [...nodes],
      edges: [...edges],
      description: 'Floyd-Warshall algorithm complete!'
    });

    return steps;
  }

  // Helper methods
  private static buildAdjacencyList(
    nodes: GraphNode[],
    edges: GraphEdge[]
  ): Map<string, string[]> {
    const adjacencyList = new Map<string, string[]>();
    
    nodes.forEach(node => {
      adjacencyList.set(node.id, []);
    });

    edges.forEach(edge => {
      adjacencyList.get(edge.source)?.push(edge.target);
      adjacencyList.get(edge.target)?.push(edge.source);
    });

    return adjacencyList;
  }

  private static getNeighborsWithWeights(
    edges: GraphEdge[],
    node: string
  ): Map<string, number> {
    const neighbors = new Map<string, number>();

    edges.forEach(edge => {
      if (edge.source === node) {
        neighbors.set(edge.target, edge.weight);
      } else if (edge.target === node) {
        neighbors.set(edge.source, edge.weight);
      }
    });

    return neighbors;
  }
}
