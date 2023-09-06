import React, { Component } from "react";
import Node from "./Node/Node";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";

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

    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    if(row === START_NODE_ROW && col === START_NODE_COL) {
      const newGrid = getOldStart(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressedStart: true });
    } 
    //work in progress 
    else if(row === FINISH_NODE_ROW && col === FINISH_NODE_COL) {
      const newGrid = getOldFinish(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressedFinish: true });
      console.log("FInish clicked")
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
    if (!this.state.mouseIsPressed && !this.state.mouseIsPressedStart && !this.state.mouseIsPressedFinish) return;

    else if(this.state.mouseIsPressedStart) {
      START_NODE_ROW = row;
      START_NODE_COL = col;
    } 
    //WOrk in progress
    else if(this.state.mouseIsPressedFinish) {
      FINISH_NODE_ROW = row;
      FINISH_NODE_COL = col;
    }
    //..
     else if(this.state.mouseIsPressed) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
    }

  }

  // // once released we no longer to create wall so set state of mouseIsPressed : false
  handleMouseUp() {
    if(this.state.mouseIsPressedStart) {
    // const newGrid = getNewStart(this.state.grid, START_NODE_ROW, START_NODE_COL);
    // this.setState({ grid : newGrid, mouseIsPressedStart: false });

  
  //toggled
  const newGrid = this.state.grid.slice();
  const node = newGrid[START_NODE_ROW][START_NODE_COL];
  //node at the given row and colm gets toggled b/w wall and not a wall
  
  const newNode = {
    //changes
    ...node,
    isStart: true,
  };
  newGrid[START_NODE_ROW][START_NODE_COL] = newNode;
  this.setState({ grid : newGrid, mouseIsPressedStart: false });
}
  
    else if(this.state.mouseIsPressedFinish) {
      const newGrid = getNewFinish(this.state.grid, FINISH_NODE_ROW, FINISH_NODE_COL);
    this.setState({ grid : newGrid, mouseIsPressedFinish: false });
    }
     else if(this.state.mouseIsPressed) {
      this.setState({ mouseIsPressed: false });
    }
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
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
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeDijkstraWrapper = () => {
    this.visualizeDijkstra();
  };

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
          className="btn btn-info" style={{margin : 10}}
          onClick={() => this.visualizeDijkstra()}
        >
          Visualize Dijkstra's Algorithm
        </button>
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
const getNewStart = (grid, row, col) => {
    START_NODE_ROW = row;
    START_NODE_COL = col;
  //toggled
  const newGrid = grid.slice();
  const node = newGrid[START_NODE_ROW][START_NODE_COL];
  //node at the given row and colm gets toggled b/w wall and not a wall
  
  const newNode = {
    //changes
    ...node,
    isStart: true,
  };
  newGrid[START_NODE_ROW][START_NODE_COL] = newNode;
  
  return newGrid;
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
