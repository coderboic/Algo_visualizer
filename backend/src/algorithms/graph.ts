interface GraphInput {
  nodes: string[];
  edges: Array<{ from: string; to: string; weight?: number }>;
  startNode?: string;
  endNode?: string;
}

export const graphAlgorithms = {
  bfs(input: GraphInput): any[] {
    const steps: any[] = [];
    const { nodes, edges, startNode = nodes[0] } = input;
    
    // Build adjacency list
    const adjacencyList: Map<string, string[]> = new Map();
    nodes.forEach(node => adjacencyList.set(node, []));
    edges.forEach(edge => {
      adjacencyList.get(edge.from)?.push(edge.to);
      if (!edge.weight) { // Undirected graph
        adjacencyList.get(edge.to)?.push(edge.from);
      }
    });
    
    const visited = new Set<string>();
    const queue: string[] = [startNode];
    visited.add(startNode);
    
    steps.push({
      type: 'init',
      nodes,
      edges,
      currentNode: startNode,
      queue: [...queue],
      visited: Array.from(visited),
      description: `Starting BFS from node ${startNode}`
    });
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      
      steps.push({
        type: 'visit',
        nodes,
        edges,
        currentNode: current,
        queue: [...queue],
        visited: Array.from(visited),
        description: `Visiting node ${current}`
      });
      
      const neighbors = adjacencyList.get(current) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
          
          steps.push({
            type: 'discover',
            nodes,
            edges,
            currentNode: current,
            discoveredNode: neighbor,
            queue: [...queue],
            visited: Array.from(visited),
            description: `Discovered node ${neighbor} from ${current}`
          });
        }
      }
    }
    
    steps.push({
      type: 'complete',
      nodes,
      edges,
      visited: Array.from(visited),
      description: 'BFS traversal complete'
    });
    
    return steps;
  },

  dfs(input: GraphInput): any[] {
    const steps: any[] = [];
    const { nodes, edges, startNode = nodes[0] } = input;
    
    // Build adjacency list
    const adjacencyList: Map<string, string[]> = new Map();
    nodes.forEach(node => adjacencyList.set(node, []));
    edges.forEach(edge => {
      adjacencyList.get(edge.from)?.push(edge.to);
      if (!edge.weight) { // Undirected graph
        adjacencyList.get(edge.to)?.push(edge.from);
      }
    });
    
    const visited = new Set<string>();
    const stack: string[] = [startNode];
    
    steps.push({
      type: 'init',
      nodes,
      edges,
      currentNode: startNode,
      stack: [...stack],
      visited: Array.from(visited),
      description: `Starting DFS from node ${startNode}`
    });
    
    while (stack.length > 0) {
      const current = stack.pop()!;
      
      if (!visited.has(current)) {
        visited.add(current);
        
        steps.push({
          type: 'visit',
          nodes,
          edges,
          currentNode: current,
          stack: [...stack],
          visited: Array.from(visited),
          description: `Visiting node ${current}`
        });
        
        const neighbors = adjacencyList.get(current) || [];
        for (const neighbor of neighbors.reverse()) {
          if (!visited.has(neighbor)) {
            stack.push(neighbor);
            
            steps.push({
              type: 'push',
              nodes,
              edges,
              currentNode: current,
              pushedNode: neighbor,
              stack: [...stack],
              visited: Array.from(visited),
              description: `Adding node ${neighbor} to stack`
            });
          }
        }
      }
    }
    
    steps.push({
      type: 'complete',
      nodes,
      edges,
      visited: Array.from(visited),
      description: 'DFS traversal complete'
    });
    
    return steps;
  },

  dijkstra(input: GraphInput): any[] {
    const steps: any[] = [];
    const { nodes, edges, startNode = nodes[0], endNode } = input;
    
    // Build adjacency list with weights
    const adjacencyList: Map<string, Array<{ node: string; weight: number }>> = new Map();
    nodes.forEach(node => adjacencyList.set(node, []));
    edges.forEach(edge => {
      adjacencyList.get(edge.from)?.push({ 
        node: edge.to, 
        weight: edge.weight || 1 
      });
    });
    
    const distances: Map<string, number> = new Map();
    const previous: Map<string, string | null> = new Map();
    const unvisited = new Set(nodes);
    
    // Initialize distances
    nodes.forEach(node => {
      distances.set(node, node === startNode ? 0 : Infinity);
      previous.set(node, null);
    });
    
    steps.push({
      type: 'init',
      nodes,
      edges,
      currentNode: startNode,
      distances: Object.fromEntries(distances),
      unvisited: Array.from(unvisited),
      description: `Starting Dijkstra's algorithm from node ${startNode}`
    });
    
    while (unvisited.size > 0) {
      // Find unvisited node with minimum distance
      let current: string | null = null;
      let minDistance = Infinity;
      
      unvisited.forEach(node => {
        const distance = distances.get(node)!;
        if (distance < minDistance) {
          minDistance = distance;
          current = node;
        }
      });
      
      if (current === null || minDistance === Infinity) break;
      
      steps.push({
        type: 'select',
        nodes,
        edges,
        currentNode: current,
        distances: Object.fromEntries(distances),
        unvisited: Array.from(unvisited),
        description: `Selected node ${current} with distance ${minDistance}`
      });
      
      unvisited.delete(current);
      
      // Update distances to neighbors
      const neighbors = adjacencyList.get(current) || [];
      for (const { node: neighbor, weight } of neighbors) {
        if (unvisited.has(neighbor)) {
          const altDistance = distances.get(current)! + weight;
          const currentDistance = distances.get(neighbor)!;
          
          steps.push({
            type: 'relax',
            nodes,
            edges,
            currentNode: current,
            neighbor,
            currentDistance,
            newDistance: altDistance,
            description: `Checking path to ${neighbor}: current=${currentDistance}, via ${current}=${altDistance}`
          });
          
          if (altDistance < currentDistance) {
            distances.set(neighbor, altDistance);
            previous.set(neighbor, current);
            
            steps.push({
              type: 'update',
              nodes,
              edges,
              currentNode: current,
              updatedNode: neighbor,
              newDistance: altDistance,
              distances: Object.fromEntries(distances),
              description: `Updated distance to ${neighbor}: ${altDistance}`
            });
          }
        }
      }
      
      if (endNode && current === endNode) {
        break;
      }
    }
    
    // Reconstruct path if endNode is specified
    if (endNode) {
      const path: string[] = [];
      let current: string | null = endNode;
      
      while (current !== null) {
        path.unshift(current);
        current = previous.get(current) || null;
      }
      
      steps.push({
        type: 'path',
        nodes,
        edges,
        path,
        totalDistance: distances.get(endNode),
        description: `Shortest path found: ${path.join(' → ')} (distance: ${distances.get(endNode)})`
      });
    }
    
    steps.push({
      type: 'complete',
      nodes,
      edges,
      distances: Object.fromEntries(distances),
      description: 'Dijkstra\'s algorithm complete'
    });
    
    return steps;
  },

  kruskal(input: GraphInput): any[] {
    const steps: any[] = [];
    const { nodes, edges } = input;
    
    // Sort edges by weight
    const sortedEdges = [...edges].sort((a, b) => (a.weight || 1) - (b.weight || 1));
    
    // Union-Find data structure
    const parent: Map<string, string> = new Map();
    const rank: Map<string, number> = new Map();
    
    nodes.forEach(node => {
      parent.set(node, node);
      rank.set(node, 0);
    });
    
    function find(node: string): string {
      if (parent.get(node) !== node) {
        parent.set(node, find(parent.get(node)!));
      }
      return parent.get(node)!;
    }
    
    function union(node1: string, node2: string): boolean {
      const root1 = find(node1);
      const root2 = find(node2);
      
      if (root1 === root2) return false;
      
      const rank1 = rank.get(root1)!;
      const rank2 = rank.get(root2)!;
      
      if (rank1 < rank2) {
        parent.set(root1, root2);
      } else if (rank1 > rank2) {
        parent.set(root2, root1);
      } else {
        parent.set(root2, root1);
        rank.set(root1, rank1 + 1);
      }
      
      return true;
    }
    
    const mst: typeof edges = [];
    let totalWeight = 0;
    
    steps.push({
      type: 'init',
      nodes,
      edges: sortedEdges,
      mst: [],
      description: 'Starting Kruskal\'s algorithm for Minimum Spanning Tree'
    });
    
    for (const edge of sortedEdges) {
      steps.push({
        type: 'consider',
        nodes,
        edges: sortedEdges,
        currentEdge: edge,
        mst: [...mst],
        totalWeight,
        description: `Considering edge ${edge.from}-${edge.to} with weight ${edge.weight || 1}`
      });
      
      if (union(edge.from, edge.to)) {
        mst.push(edge);
        totalWeight += edge.weight || 1;
        
        steps.push({
          type: 'add',
          nodes,
          edges: sortedEdges,
          addedEdge: edge,
          mst: [...mst],
          totalWeight,
          description: `Added edge ${edge.from}-${edge.to} to MST`
        });
      } else {
        steps.push({
          type: 'skip',
          nodes,
          edges: sortedEdges,
          skippedEdge: edge,
          mst: [...mst],
          totalWeight,
          description: `Skipped edge ${edge.from}-${edge.to} (would create cycle)`
        });
      }
      
      if (mst.length === nodes.length - 1) {
        break;
      }
    }
    
    steps.push({
      type: 'complete',
      nodes,
      edges: sortedEdges,
      mst,
      totalWeight,
      description: `MST complete with total weight: ${totalWeight}`
    });
    
    return steps;
  }
};