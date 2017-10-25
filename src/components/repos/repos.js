import React, { Component } from 'react';
import './repos.css';

class Repos extends Component {
  handleClick(repo) {
    this.props.clickHandler(repo);
  }

  makeRepoElements() {
    if (!this.props.repos) {
      return;
    }

    const repos = this.props.repos;
    const repoElements = repos.map((repo) => {
      let className = 'menu-item repo';

      if (this.props.currentRepo && (repo.full_name === this.props.currentRepo.full_name)) {
        className += ' selected';
      }

      return (
        <a 
          onClick={this.handleClick.bind(this, repo)} 
          key={repo.full_name}
          className={className}>
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