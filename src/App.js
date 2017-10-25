import './App.css';

import React, { Component } from 'react';
import GitHubService from './services/github';
import Repos from './components/repos/repos'

class App extends Component {
  constructor() {
    super();
    this.github = new GitHubService();
    this.getRepos();

    this.state = {
      repos: null,
      currentRepo: null,
      currentIssues: null,
      isLoadingIssue: true,
      isLoadingRepos: true,
    }
  }

  getRepos() {
    this.github.getRepos().then(({data}) => {
      this.setState({
        repos: data
      });
    });
  }

  setCurrentRepo(repo) {
    this.setState({
      currentRepo: repo
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.currentRepo) {
      return;
    }

    if ((prevState.currentRepo && prevState.currentRepo.full_name) !== this.state.currentRepo.full_name) {
      this.github.getIssues(this.state.currentRepo).then(({data}) => console.log(data));
    }
    
  }

  render() {
    return (
      <div className="container">
        <div className="column one-half">
          <Repos 
            repos={this.state.repos}
            clickHandler={this.setCurrentRepo.bind(this)}/>
        </div>
        <div className="columns">
          <div className="column one-half">
            <div className="Box">
              <div className="Box-header">
                <h3 className="Box-title">
                  Box title
                </h3>
              </div>
              <div className="Box-body">
                Box body
              </div>
              <div className="Box-footer">
                Box footer
              </div>
            </div>
          </div>

        </div>
      </div>
        
    );
  }
}

export default App;
