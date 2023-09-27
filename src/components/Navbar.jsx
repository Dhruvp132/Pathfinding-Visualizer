import React, { Component } from "react";

export default class Navbar extends Component {
  // Define a function to handle the click event of the "Visualize Dijkstra's Algorithm" button
  render() {
    const {
      visualizeDijkstra,
      visualizeBFS,
      visualizeDFS,
      clearBoard,
      clearPath,
      clearWalls,
    } = this.props;
    
    return (
      <div>
        <nav className="navbar navbar-expand-lg bg-body-tertiary" style = {{marginLeft: '12px', margin : "10px"}}>

          <span class="navbar-brand mb-0 h1">PathFinder Visualizer</span>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNavDropdown"
              aria-controls="navbarNavDropdown"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    onClick={clearPath}
                    style = {{ marginRight : "15px", marginLeft : '22px'  }}
                  >
                    Clear Path
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    onClick={clearWalls}
                    style = {{ marginRight : "15px", }}
                  >
                    Clear Walls
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    onClick={clearBoard}
                    style = {{ marginRight : "15px", }}
                  >
                    Clear Board
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    onClick={visualizeDijkstra}
                    style = {{ marginRight : "15px", }}
                  >
                    Dijkstra's Algorithm
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    onClick={visualizeBFS}
                    style = {{ marginRight : "15px", }}
                  >
                    Breadth First Search
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    onClick={visualizeDFS}
                    style = {{ marginRight : "15px", }}
                  >
                    Depth First Search
                  </button>
                </li>
              </ul>
            </div>
        </nav>
      </div>
    );
  }
}
