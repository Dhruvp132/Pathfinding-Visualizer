// Performs Dijkstra's algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.

//IN DIJKSTRA'S ALGORITHM WE NEED A POINTER TO KEEP TRACK OF THE PREVIOUS
// NODE ITS PARENT NODE. ONCE YOU ARRIVED TO THE DESTINATION TO 
//DIJKSTRA YOU;VE TO WORK YOUR WAY BACK IN LINEAR TIME TO 
// FIND THE SHORTEST PATH
export function dijkstra(grid, startNode, finishNode) {
//   const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
  if(!startNode || !finishNode || startNode === finishNode) {
    console.log("wrong")
      return false;
  }
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);
  while (!!unvisitedNodes.length) { //Effectively checks untill it is > 0 andconverts it into boolean
    // visit and then update their distance whatever current distance is + 1
    sortNodesByDistance(unvisitedNodes);
    
    const closestNode = unvisitedNodes.shift();
    // console.log("-M " + closestNode.row + "  "+ closestNode.col)
    // If we encounter a wall, we skip it.
    if (closestNode.isWall) continue;
    // If the closest node is at a distance of infinity,
    // we must be trapped and should therefore stop.
    //=========== HANDLE IMPOSSIBLE ==============
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;
    // visitedNodedInOrder to return the array in the order we visited them 
    updateUnvisitedNeighbors(closestNode, grid);
  }
}

function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
  }

// function updateNeighbors(node, grid) REPLACED WITH THIS
/* when we are updating the neighbors with the new Distance we mark 
them with a previous node that is the current we're at 
that will eventually gives us shortest path even we update the neighbor from m
multiple different nodes this should work 
AND THEN ONCE WE HAVE VISITEDNODE IN ORDER FROM DIJKSTRA 
WE CAN CALL ANOTHER NODE TO GET INTO THE SHORTEST PATH ORDER STARTING 
WITH THE !!!!!!FINISH NODE!!!!! NODE MAKING OUR WAY BACK */


// WROTE METHOD getNodesInShortestPathOrder(finishNode) check that next 
function updateUnvisitedNeighbors(node, grid) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
      neighbor.distance = node.distance + 1;
      neighbor.previousNode = node; //like linkedlist
    }
  }
  
  function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const {col, row} = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]); 
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
  }

function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
      for (const node of row) {
        // console.log(node)
        nodes.push(node); // node is an object with all defined properties 
      }
    }
    return nodes;
  }

  // Function for traversing our way backwards through this 
  // .previousNode
  export function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }



