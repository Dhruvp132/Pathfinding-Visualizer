const unvisitedNodes = [];
export function breadthFirst(grid, startNode, finishNode) {
  if (!startNode || !finishNode || startNode === finishNode) {
    console.log("wrong");
    return false;
  }
  // const unvisitedNodes = [startNode];
  //working with unshift not push ?
  unvisitedNodes.unshift(startNode);
  const visitedNodesInOrder = [];
  // let exploredNodes = { isStart: true };

  while (!!unvisitedNodes.length) {
    const currNode = unvisitedNodes.shift();
    if (currNode.isWall) continue;
    visitedNodesInOrder.push(currNode);
    currNode.isVisited = true;
    if (currNode === finishNode) return visitedNodesInOrder;
    const unvisitedNeighbors = getUnvisitedNeighbors(currNode, grid);
    for (const neighbor of unvisitedNeighbors) {
      // exploredNodes[neighbor] = true;
      unvisitedNodes.push(neighbor);
      neighbor.previousNode = currNode; 
      neighbor.isVisited = true;//like linkedlist
    }
  }
}

// combination needeed = 1 top 1 right while ( l u l b)
function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row, isWall } = node;
  const notWall = !isWall;

  // Theres a big difference between unshift and push replace and figure out
  if (notWall && row > 0) neighbors.push(grid[row - 1][col]);
  if (notWall && col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  if (notWall && row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (notWall && col > 0) neighbors.push(grid[row][col - 1]);

  return neighbors.filter((neighbor) => !neighbor.isVisited);
}


// Function for traversing our way backwards through this
// .previousNode
export function getNodesInShortestPathOrderBFS(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
