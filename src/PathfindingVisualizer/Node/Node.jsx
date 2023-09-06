import React, {Component} from 'react';

import './Node.css';

export class Node extends Component {
  render() {
    const {
      col,
      isFinish,
      isStart,
      isWall,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
      row,
    } = this.props;

    // this means check if extra class isFinish is true then add node-finish 
    // else check isStart if true node-start else if false check isWall whether it is 
    // true then add node-wall else don't add( i.e. '')
    const extraClassName = isFinish
      ? 'node-finish'
      : isStart
      ? 'node-start'
      : isWall
      ? 'node-wall'
      : '';
// this 3 event handlers are passed down to the parent 
// compoent which is PathfindingVisualizer
    return (
      <div
        id={`node-${row}-${col}`} // to get access to that element by id
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)} // when press and have it be a wall
        onMouseEnter={() => onMouseEnter(row, col)}  //Hover over an element
        onMouseUp={() => onMouseUp()}></div>    // When release
    );
  }
}
// we can say so that onmouseclick is like merged mousedown and up 
// these callback on the event are defined on pathfinding.jsx
// functionality to create walls on the grid when you click on a node 
// or to turn back into normal if already a wall and when you click and 
// drag you also want to be able to create walls for that 3 mouse listener
export default Node;