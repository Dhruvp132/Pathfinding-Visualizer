import React, { Component } from "react";
import Node from "./Node/Node";
import { depthFirst, getNodesInShortestPathOrderDFS } from "../algorithms/dfs";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";
import {
  breadthFirst,
  getNodesInShortestPathOrderBFS,
} from "../algorithms/bfs";

import "./PathfindingVisualizer.css";
import Navbar from "../components/Navbar";
let START_NODE_ROW = 10;
let START_NODE_COL = 15;
let FINISH_NODE_ROW = 10;
let FINISH_NODE_COL = 35;

export class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      mouseIsPressedStart: false,
      mouseIsPressedFinish: false,
      previousStart: {
        row: START_NODE_ROW,
        col: START_NODE_COL,
      },
      previousFinish: {
        row: FINISH_NODE_ROW,
        col: FINISH_NODE_COL,
      },
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({
      grid,
      previousStart: { row: START_NODE_ROW, col: START_NODE_COL },
    });
  }

  //== Mouse Events ==
  handleMouseDown(row, col) {
    if (row === START_NODE_ROW && col === START_NODE_COL) {
      this.setState({ mouseIsPressedStart: true });
    } else if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) {
      this.setState({ mouseIsPressedFinish: true });
    } else {
      //using prevState helps faster
      // this.setState((prevState) => ({
      //   grid: getNewGridWithWallToggled(prevState.grid, row, col),
      //   mouseIsPressed: true,
      // }));
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
  }

  handleMouseEnter(row, col) {
    if (this.state.mouseIsPressedStart) {
      this.setState((prevState) => {
        const newGrid = prevState.grid.slice();
        const startNode = newGrid[row][col];
        startNode.isStart = true; // Set isStart for the new location

        const previousStartNode =
          newGrid[prevState.previousStart.row][prevState.previousStart.col];
        previousStartNode.isStart = false;
        START_NODE_ROW = row;
        START_NODE_COL = col;

        const previousStart = { row, col };
        return {
          grid: newGrid,
          previousStart,
        };
      });
    } else if (this.state.mouseIsPressedFinish) {
      this.setState((prevState) => {
        const newGrid = prevState.grid.slice();
        const finishNode = newGrid[row][col];
        finishNode.isFinish = true; // Set isStart for the new location

        const previousFinishNode =
          newGrid[prevState.previousFinish.row][prevState.previousFinish.col];
        previousFinishNode.isFinish = false;
        FINISH_NODE_ROW = row;
        FINISH_NODE_COL = col;

        const previousFinish = { row, col };
        return {
          grid: newGrid,
          previousFinish,
        };
      });
    } else if (this.state.mouseIsPressed) {
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid });
    } else return;
  }

  handleMouseUp() {
    if (this.state.mouseIsPressedStart) {
      this.setState((prevState) => {
        const newGrid = prevState.grid.slice();
        const startNode =
          newGrid[prevState.previousStart.row][prevState.previousStart.col];
        startNode.isStart = true;

        return {
          grid: newGrid,
          mouseIsPressedStart: false,
        };
      });
    } else if (this.state.mouseIsPressedFinish) {
      this.setState((prevState) => {
        const newGrid = prevState.grid.slice();
        const finishNode =
          newGrid[prevState.previousFinish.row][prevState.previousFinish.col];
        finishNode.isFinish = true;

        return {
          grid: newGrid,
          mouseIsPressedFinish: false,
        };
      });
    } else if (this.state.mouseIsPressed) {
      this.setState({ mouseIsPressed: false });
    } else {
      this.setState({
        mouseIsPressed: false,
        mouseIsPressedStart: false,
        mouseIsPressedFinish: false,
      });
    }
  }

  //=== Animations functions ===
  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 50 * i);
    }
  }

  //============== Visualize Dijkstra ==========================
  visualizeDijkstra() {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  //============== Visualize Dfs ==========================
  visualizeDFS() {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = depthFirst(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrderDFS(finishNode);
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  //============== Visualize Bfs==========================
  visualizeBFS() {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = breadthFirst(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrderBFS(finishNode);
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeDijkstraWrapper = () => {
    this.visualizeDijkstra();
  };
  visualizeDFSWrapper = () => {
    this.visualizeDFS();
  };
  visualizeBFSWrapper = () => {
    this.visualizeBFS();
  };

  clearWalls() {
    const grid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        currentRow.push(createNode(col, row));
      }
      grid.push(currentRow);
    }
    START_NODE_ROW = 10;
    START_NODE_COL = 15;
    this.setState({ grid: grid });
  }

  clearPath() {
    for (let row = 0; row < 20; row++) {
      for (let col = 0; col < 50; col++) {
        if (row === START_NODE_ROW && col === START_NODE_COL)
          document.getElementById(`node-${row}-${col}`).className =
            "node node-start";
        else if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL)
          document.getElementById(`node-${row}-${col}`).className =
            "node node-finish";
        else if (
          document
            .getElementById(`node-${row}-${col}`)
            .classList.contains("node-wall")
        ) {
          continue;
        } else {
          let el = document.getElementById(`node-${row}-${col}`);
          if (el.classList.contains("node-shortest-path") || el.classList.contains("node-visited")) {
            el.classList.remove("node-shortest-path");
            el.classList.remove("node-visited");
          } 
          document.getElementById(`node-${row}-${col}`).classList.add("node") ;
        }
      }
    }
  }

  clearBoard() {
    for (let row = 0; row < 20; row++) {
      for (let col = 0; col < 50; col++) {
        if (row === START_NODE_ROW && col === START_NODE_COL)
          document.getElementById(`node-${row}-${col}`).className =
            "node node-start";
        else if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL)
          document.getElementById(`node-${row}-${col}`).className =
            "node node-finish";
        else document.getElementById(`node-${row}-${col}`).className = "node";
      }
    }
    const newGrid = getInitialGrid();
    this.setState({ grid: newGrid });
  }

  render() {
    // const { nodes } = this.state;
    // console.log(nodes); // to see how node will look

    const { grid, mouseIsPressed } = this.state;

    return (
      <>
        <Navbar
          visualizeDijkstra={() => {
            this.visualizeDijkstra();
          }}
          visualizeBFS={() => {
            this.visualizeBFS();
          }}
          visualizeDFS={() => {
            this.visualizeDFS();
          }}
          clearBoard={() => {
            this.clearBoard();
          }}
          clearPath={() => {
            this.clearPath();
          }}
          clearWalls={() => {
            this.clearWalls();
          }}
        />
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

export default PathfindingVisualizer;

//Refactored to get the initial grid
const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

// that takes in row and col and add bunch of properties
const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity, // bydefault infinity for each node
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  //toggled
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  //node at the given row and colm gets toggled b/w wall and not a wall
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

//======== This stuff is what I do without using prevState ======

//IMP
//Also change or edit in the mousevents handlers
// and the state objects

// //UPDATED NEW START NOW IT WILL TRAVERSE THROUGH EVERY GRID AND
// // REMOVE THE NODES WHICH ARE ASSIGNED WITH NODE-START CLASS
// const clearPrevious = (grid) => {
//   for (let row = 0; row < 20; row++) {
//     for (let col = 0; col < 50; col++) {
//       if (row === START_NODE_ROW && col === START_NODE_COL) {
//         const node = grid[row][col];
//         const newNode = {
//           //changes
//           ...node,
//           isStart: true,
//         };
//         grid[row][col] = newNode;
//       } else if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) {
//         const node = grid[row][col];
//         const newNode = {
//           //changes
//           ...node,
//           isFinish: true,
//         };
//         grid[row][col] = newNode;
//       } else {
//         const node = grid[row][col];
//         const newNode = {
//           //changes
//           ...node,
//           isStart: false,
//           isFinish: false,
//         };
//         grid[row][col] = newNode;
//       }
//     }
//   }
// };

// const getOldStart = (grid, row, col) => {
//   START_NODE_ROW = row;
//   START_NODE_COL = col;
//   //toggled
//   const newGrid = grid.slice();
//   const node = newGrid[START_NODE_ROW][START_NODE_COL];
//   //node at the given row and colm gets toggled b/w wall and not a wall

//   const newNode = {
//     //changes
//     ...node,
//     isStart: false,
//   };
//   newGrid[START_NODE_ROW][START_NODE_COL] = newNode;

//   return newGrid;
// };

// //UPDATED NEW START NOW IT WILL TRAVERSE THROUGH EVERY GRID AND
// // REMOVE THE NODES WHICH ARE ASSIGNED WITH NODE-START CLASS
// const getNewStart = (grid) => {
//   for (let row = 0; row < 20; row++) {
//     for (let col = 0; col < 50; col++) {
//       if (row !== START_NODE_ROW &&col !== START_NODE_COL ) {
//         const node = grid[row][col];
//         const newNode = {
//           //changes
//           ...node,
//           isStart: false,
//         };
//         grid[row][col] = newNode;
//       } else {
//         const node = grid[START_NODE_ROW][START_NODE_COL];

//         const newNode = {
//           //changes
//           ...node,
//           isStart: true,
//         };
//         grid[START_NODE_ROW][START_NODE_COL] = newNode;
//       }
//     }
//   }
// };

// const getOldFinish = (grid, row, col) => {
//   const newGrid = grid.slice();
//   const node = newGrid[row][col];

//   const newNode = {
//     //changes
//     ...node,
//     isFinish: false,
//   };
//   newGrid[FINISH_NODE_ROW][FINISH_NODE_COL] = newNode;

//   return newGrid;
// };
// const getNewFinish = (grid, row, col) => {
//   const newGrid = grid.slice();
//   const node = newGrid[row][col];
//   const newNode = {
//     //changes
//     ...node,
//     isFinish: true,
//   };
//   newGrid[FINISH_NODE_ROW][FINISH_NODE_COL] = newNode;

//   return newGrid;
// };

//LOGIC BTS FOR MOVING STARTING NODE && MOVING FINISH NODE :
/* same as toggle wall just the only difference is that change grid is every row col changes 
whereas in starting node and finish node movable part we only change grid when the mouse is up and Down
i) when mouseIsDown we changed the grid to remove the starting node class 
ii) when mouseIsUp we change the grid to add the starting class by using !node.isStart
*/
