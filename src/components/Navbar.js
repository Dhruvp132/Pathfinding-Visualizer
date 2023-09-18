import React, { Component } from "react";
import { visualizeDijkstra } from "../PathfindingVisualizer/PathfindingVisualizer";
export default class Navbar extends Component {
  // Define a function to handle the click event of the "Visualize Dijkstra's Algorithm" button
  render() {
    const { visualizeDijkstra } = this.props;
    return (
      <div>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">
              {" "}
              Path Finding Visualizer{" "}
            </a>
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
                <button type="button" className="btn btn-info">
                  Clear Path
                </button>
                <button type="button" className="btn btn-info">
                  Clear Walls
                </button>
                <button type="button" className="btn btn-info">
                  Clear Board
                </button>

                {/* we can't call directly call visualizeDijkstra  */}
                <button
                  type="button"
                  className="btn btn-info"
                  onClick={visualizeDijkstra}
                >
                  Visualize Dijkstra's Algorithm
                </button>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Algorithms
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="#">
                        Dijkstra Algorithm
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Depth First Search
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Breadth First Search
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}
