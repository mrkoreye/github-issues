import React, { Component } from 'react';
import './issues.css';
import { DropTarget } from 'react-dnd'
import Issue from '../issue/issue';

const issueTarget = {
	drop() {},
}

class Issues extends Component {
  makeIssueElements() {
    if (!this.props.issues || this.props.issues.length === 0) {
      return [
        <div 
          key="blank"
          className="blankslate">
          <h3>No issues found</h3>
          <p>We didn't find any issues for the selected repository.</p>
        </div>
      ];
    }

    const issues = this.props.issues;
    const issueElements = issues.map((issue) => {
      return (
        <Issue
          key={issue.id}
          moveIssue={this.props.moveIssue}
				  findIssue={this.props.findIssue}
          issue={issue}/>
      );
    });

    return issueElements;
  }

  render() {
    const issues = this.makeIssueElements();
    const { connectDropTarget } = this.props

    return connectDropTarget(
      <div>
        {issues}
      </div>
    )
  }
}

export default DropTarget('issue', issueTarget, connect => ({
	connectDropTarget: connect.dropTarget(),
}))(Issues);
