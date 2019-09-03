import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from 'antd';
import "./Home.css";

class Home extends Component {
  render() {
    return (
      <div className="home-wrapper"> 
        <Link to="/Form">
          <Button type="dashed" className="form-review-button">Add New Review</Button>
        </Link>
        <Link to="/Reviews">
          <Button type="dashed" className="form-review-button">Review List</Button>
        </Link>
      </div>
    );
  }
}

export default Home;
