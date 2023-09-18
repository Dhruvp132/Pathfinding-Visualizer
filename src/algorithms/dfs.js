const unvisitedNodes = [];
export function depthFirst(grid, startNode, finishNode) {
  if (!startNode || !finishNode || startNode === finishNode) {
    console.log("wrong");
    return false;
  }

  const visitedNodesInOrder = [];
  //working with unshift not push ?
  unvisitedNodes.unshift(startNode);

  while (!!unvisitedNodes.length) {
    const currNode = unvisitedNodes.pop();
    if (currNode.isWall) continue;
    currNode.isVisited = true;
    if(currNode.isVisited) console.log("visited " + currNode.row + " " + currNode.col)
    visitedNodesInOrder.push(currNode);
    if (currNode === finishNode) return visitedNodesInOrder;
    const unvisitedNeighbors = getUnvisitedNeighbors(currNode, grid);
    for (const neighbor of unvisitedNeighbors) {
      unvisitedNodes.push(neighbor);
      neighbor.previousNode = currNode; //like linkedlist
    }
  }
  return visitedNodesInOrder;
}

// combination needeed = 1 top 1 right while ( l u l b)
function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row} = node;
  

  // Theres a big difference between unshift and push replace and figure out
  if (row > 0) neighbors.unshift(grid[row - 1][col]);
  if (col < grid[0].length - 1) neighbors.unshift(grid[row][col + 1]);
  if (row < grid.length - 1) neighbors.unshift(grid[row + 1][col]);
  if (col > 0) neighbors.unshift(grid[row][col - 1]);

  return neighbors.filter((neighbor) => !neighbor.isVisited);
}

// Function for traversing our way backwards through this
// .previousNode
export function getNodesInShortestPathOrderDFS(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
