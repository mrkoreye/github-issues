import React, { Component } from 'react';
import './repo.css';

class Repo extends Component {
  constructor(props) {
    super(props);
  }

  handleClick() {
    this.props.clickHandler();
  }

  render() {
    <a 
      onClick={this.handleClick.bind(this)} 
      className="menu-item">
      Get repos
    </a>
  }
}

export default Repo;