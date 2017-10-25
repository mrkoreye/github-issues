import './App.css';

import React, { Component } from 'react';
import GitHubService from './services/github';
import Repos from './components/repos/repos';
import Issues from './components/issues/issues';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

const ISSUE_ORDERS_NAME = 'issue-orders';
const OAUTH_KEY_NAME = 'oauth-key';

class App extends Component {
  constructor() {
    super();
    this.github = null;
    let oauthKey = '';
    this.localStorage = window.localStorage;

    if (this.localStorage.getItem(OAUTH_KEY_NAME)) {
      oauthKey = this.localStorage.getItem(OAUTH_KEY_NAME);
      this.github = new GitHubService(oauthKey);
      this.getRepos();
    }

    this.state = {
      repos: null,
      currentRepo: null,
      currentIssues: null,
      isLoadingIssue: true,
      isLoadingRepos: true,
      oauthKey: oauthKey,
    }
  }

  setNewIssueOrder() {
    if (this.state.currentRepo) {
      // TODO: catch errors from JSON parse
      const currentOrders = JSON.parse(this.localStorage.getItem(ISSUE_ORDERS_NAME)) || {};
      const currentRepoName = this.state.currentRepo.full_name;
      const currentIssuesOrder = this.state.currentIssues.map((issue) => issue.id);
      Object.assign(currentOrders, {
        [currentRepoName]: currentIssuesOrder,
      });

      this.localStorage.setItem(ISSUE_ORDERS_NAME, JSON.stringify(currentOrders));
    }
  }

  getIssueOrderFromStorage() {
    if (this.state.currentRepo) {
      // TODO: catch errors from JSON parse
      const currentOrders = JSON.parse(this.localStorage.getItem(ISSUE_ORDERS_NAME));
      const currentRepoName = this.state.currentRepo.full_name;

      return currentOrders[currentRepoName];
    }
  }

  getRepos() {
    if (!this.github) {
      return;
    }

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
      this.github.getIssues(this.state.currentRepo).then(({data}) => {
        const issueOrder = this.getIssueOrderFromStorage();
        let sortedIssues;

        if (issueOrder) {
          sortedIssues = data.sort((item1, item2) => {
            return issueOrder.indexOf(item1.id) < issueOrder.indexOf(item2.id) ? -1 : 1;
          });
        } else {
          sortedIssues = data;
        }


        this.setState({
          currentIssues: sortedIssues,
        })
      });
    }

    if (this.state.currentIssues && this.state.currentIssues.length) {
      this.setNewIssueOrder();
    }
  }

  moveIssue(id, atIndex) {
    const { index } = this.findIssue(id);
    // Move item in array
    const newCurrentIssues = this.state.currentIssues.slice();
    newCurrentIssues.splice(atIndex, 0, newCurrentIssues.splice(index, 1)[0]);

		this.setState({
      currentIssues: newCurrentIssues,
    });
	}

	findIssue(id) {
		const { currentIssues } = this.state;
		const currentIssue = currentIssues.filter(issue => issue.id === id)[0]

		return {
			currentIssue,
			index: currentIssues.indexOf(currentIssue),
		}
  }
  
  handleOauthChange(event) {
    this.setState({oauthKey: event.target.value});
  }

  handleOauthSubmit(event) {
    event.preventDefault();
    this.github = new GitHubService(this.state.oauthKey);
    this.localStorage.setItem(OAUTH_KEY_NAME, this.state.oauthKey);
    this.getRepos();
  }

  render() {
    let reposClassName = 'column';
    
    if (this.state.currentIssues) {
      reposClassName += ' one-half';
    } else {
      reposClassName += ' centered';
    }

    return (
      <div className="container">
        <h1>GitHub Issue Tracker</h1>
        <div className="key-input">
          <form onSubmit={this.handleOauthSubmit.bind(this)}>
            <label>
              <h4>API Key:</h4>
              <input 
                type="text" 
                className="form-control"
                value={this.state.oauthKey} 
                onChange={this.handleOauthChange.bind(this)} />
            </label>
            <button 
              className="m-1 btn btn-primary" 
              type="submit">
              Submit
            </button>
          </form>
        </div>
        { this.state.repos && this.state.repos.length &&
          <div className={reposClassName}>
            <h5>Repositories</h5>
            <Repos 
              repos={this.state.repos}
              currentRepo={this.state.currentRepo}
              clickHandler={this.setCurrentRepo.bind(this)}/>
          </div>
        }
        { this.state.currentIssues &&
          <div className="column one-half">
            <h5>Issues</h5>
            <Issues
              moveIssue={this.moveIssue.bind(this)}
              findIssue={this.findIssue.bind(this)}
              issues={this.state.currentIssues} />
          </div>
        }
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
