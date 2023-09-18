import React, { Component } from "react";
import Node from "./Node/Node";
import { depthFirst, getNodesInShortestPathOrderDFS } from "../algorithms/dfs";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";
import { breadthFirst, getNodesInShortestPathOrderBFS } from "../algorithms/bfs";

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
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    if (row === START_NODE_ROW && col === START_NODE_COL) {
      const newGrid = getOldStart(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressedStart: true });
      console.log("start picked");
    }
    //work in progress
    else if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) {
      const newGrid = getOldFinish(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressedFinish: true });
    }
    //..
    else {
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
    //this is true; we're gonna want this boolean in mouseEnter
  }

  //when mouse enter we only want to make nodes that enter walls
  // or not walls if we're currently pressed we only want click and
  // drag

  handleMouseEnter(row, col) {
    // this.state.mouseIspressed is true then ! -> false next line will execute
    //if will not run for mouseIsPressed : true;
    if (this.state.mouseIsPressedStart) {
      START_NODE_ROW = row;
      START_NODE_COL = col;

      // Create a new grid copy
      const newGrid = this.state.grid.slice();
      // Reset isStart for the previous starting node
      newGrid[this.state.previousStart.row][
        this.state.previousStart.col
      ].isStart = false;
      // Set the new starting node
      newGrid[row][col].isStart = true;
      // Update the state
      this.setState({
        grid: newGrid,
        previousStart: { row, col },
      });
    }

    //WOrk in progress
    else if (this.state.mouseIsPressedFinish) {
      FINISH_NODE_ROW = row;
      FINISH_NODE_COL = col;
    }
    //..
    else if (this.state.mouseIsPressed) {
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid });
    } else return;
  }

  // // once released we no longer to create wall so set state of mouseIsPressed : false
  handleMouseUp() {
    if (this.state.mouseIsPressedStart) {
      getNewStart(this.state.grid);
      this.setState({ mouseIsPressedStart: false });

      console.log("strt NEW");

      // //toggled
      // const newGrid = this.state.grid.slice();
      // const node = newGrid[START_NODE_ROW][START_NODE_COL];
      // //node at the given row and colm gets toggled b/w wall and not a wall

      // const newNode = {
      //   //changes
      //   ...node,
      //   isStart: true,
      // };
      // newGrid[START_NODE_ROW][START_NODE_COL] = newNode;
      // this.setState({ grid : newGrid, mouseIsPressedStart: false });
    } else if (this.state.mouseIsPressedFinish) {
      const newGrid = getNewFinish(
        this.state.grid,
        FINISH_NODE_ROW,
        FINISH_NODE_COL
      );
      this.setState({ grid: newGrid, mouseIsPressedFinish: false });
    } else if (this.state.mouseIsPressed) {
      this.setState({ mouseIsPressed: false });
    }
  }

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

  visualizeDijkstra() {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }


  //============== Visualize Dfs==========================
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
    const newGrid = this.state.grid.slice();
    for (let row = 0; row < 20; row++) {
      for (let col = 0; col < 50; col++) {
        if(row === START_NODE_ROW && col === START_NODE_COL ||
          row === FINISH_NODE_ROW && col === FINISH_NODE_COL){
          continue
          } else {
          const node = newGrid[row][col] 
          const newNode = {
            ...node ,
            distance: Infinity, // bydefault infinity for each node
            isVisited: false,
            previousNode: null,
          }
          newGrid[row][col] = newNode;
        }
      } 
    }
    this.setState({grid : newGrid})
  }

  clearBoard() {
    const newGrid  = getInitialGrid();
    this.setState({grid : newGrid})  
  }

  render() {
    // const { nodes } = this.state;
    // console.log(nodes); // to see how node will look

    const { grid, mouseIsPressed } = this.state;

    return (
      <>
        <Navbar visualizeDijkstra={this.visualizeDijkstraWrapper}></Navbar>
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

        <button
          type="button"
          className="btn btn-info"
          style={{ margin: 10 }}
          onClick={() => this.visualizeDijkstra()}
        >
          Visualize Dijkstra's Algorithm
        </button>
        <button
          type="button"
          className="btn btn-info"
          style={{ margin: 10 }}
          onClick={() => this.visualizeDFS()}
        >
          Visualize DFS Algorithm
        </button>
        <button
          type="button"
          className="btn btn-danger"
          style={{ margin: 10 }}
          onClick={() => this.visualizeBFS()}
        >
          Visualize BFS Algorithm
        </button>
        <button
          type="button"
          className="btn btn-info"
          style={{ margin: 10 }}
          onClick={() => this.clearWalls()}
        >
          clearWalls
        </button>
        <button
          type="button"
          className="btn btn-info"
          style={{ margin: 10 }}
          onClick={() => this.clearPath()}
        >
          clearPath
        </button>
        <button
          type="button"
          className="btn btn-info"
          style={{ margin: 10 }}
          onClick={() => this.clearBoard()}
        >
          clearBoard
        </button>
        <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Speed
                  </a>
        <ul className="dropdown-menu">
                    <li id="adjustFast">
                      <a className="dropdown-item" href="#">
                        Fast
                      </a>
                    </li>
                    <li id="adjustAverage">
                      <a className="dropdown-item" href="#">
                        Average
                      </a>
                    </li>
                    <li id="adjustSlow">
                      <a className="dropdown-item" href="#">
                        Slow
                        </a>
                    </li>
                  </ul>
                </li>
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

const getOldStart = (grid, row, col) => {
  START_NODE_ROW = row;
  START_NODE_COL = col;
  //toggled
  const newGrid = grid.slice();
  const node = newGrid[START_NODE_ROW][START_NODE_COL];
  //node at the given row and colm gets toggled b/w wall and not a wall

  const newNode = {
    //changes
    ...node,
    isStart: false,
  };
  newGrid[START_NODE_ROW][START_NODE_COL] = newNode;

  return newGrid;
};


//UPDATED NEW START NOW IT WILL TRAVERSE THROUGH EVERY GRID AND 
// REMOVE THE NODES WHICH ARE ASSIGNED WITH NODE-START CLASS 
const getNewStart = (grid) => {
  //   START_NODE_ROW = row;
  //   START_NODE_COL = col;
  // //toggled
  // const newGrid = grid.slice();
  // const node = newGrid[START_NODE_ROW][START_NODE_COL];
  // //node at the given row and colm gets toggled b/w wall and not a wall

  // const newNode = {
  //   //changes
  //   ...node,
  //   isStart: true,
  // };
  // newGrid[START_NODE_ROW][START_NODE_COL] = newNode;

  for (let row = 0; row < 20; row++) {
    for (let col = 0; col < 50; col++) {
      if (row !== START_NODE_ROW &&col !== START_NODE_COL ) {
        const node = grid[row][col];
        const newNode = {
          //changes
          ...node,
          isStart: false,
        };
        grid[row][col] = newNode;
      } else {
        const node = grid[START_NODE_ROW][START_NODE_COL];

        const newNode = {
          //changes
          ...node,
          isStart: true,
        };
        grid[START_NODE_ROW][START_NODE_COL] = newNode;
      }
    }
  }
};

const getOldFinish = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];

  const newNode = {
    //changes
    ...node,
    isFinish: false,
  };
  newGrid[FINISH_NODE_ROW][FINISH_NODE_COL] = newNode;

  return newGrid;
};
const getNewFinish = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    //changes
    ...node,
    isFinish: true,
  };
  newGrid[FINISH_NODE_ROW][FINISH_NODE_COL] = newNode;

  return newGrid;
};

//LOGIC BTS FOR MOVING STARTING NODE && MOVING FINISH NODE :
/* same as toggle wall just the only difference is that change grid is every row col changes 
whereas in starting node and finish node movable part we only change grid when the mouse is up and Down
i) when mouseIsDown we changed the grid to remove the starting node class 
ii) when mouseIsUp we change the grid to add the starting class by using !node.isStart
*/
