import React, { Component } from 'react';
import './repos.css';

class Repos extends Component {
  handleClick(repo) {
    this.props.clickHandler(repo);
  }

  repo() {

  }

  makeRepoElements() {
    if (!this.props.repos) {
      return;
    }

    const repos = this.props.repos;
    const repoElements = repos.map((repo) => {
      return (
        <a 
          onClick={this.handleClick.bind(this, repo)} 
          key={repo.full_name}
          className="menu-item">
          {repo.full_name}
        </a>
      );
    });

    return repoElements;
  }

  render() {
    const repos = this.makeRepoElements();

    return (
      <nav className="menu">
        {repos}
      </nav>
    )
  }
}

export default Repos;