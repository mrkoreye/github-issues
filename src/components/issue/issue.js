import React, { Component } from 'react';
import showdown from 'showdown';

import { DragSource, DropTarget } from 'react-dnd'

const style = {
	border: '1px dashed gray',
	padding: '0.5rem 1rem',
	marginBottom: '.5rem',
	backgroundColor: 'white',
	cursor: 'move',
}

const issueSource = {
	beginDrag(props) {
		return {
			id: props.issue.id,
			originalIndex: props.findIssue(props.issue.id).index,
		}
	},

	endDrag(props, monitor) {
    const { id: droppedId, originalIndex } = monitor.getItem();
		const didDrop = monitor.didDrop()

		if (!didDrop) {
			props.moveIssue(droppedId, originalIndex);
		}
	},
}

const issueTarget = {
	canDrop() {
		return false
	},

	hover(props, monitor) {
		const { id: draggedId } = monitor.getItem();
    const { id: overId } = props.issue;

		if (draggedId !== overId) {
			const { index: overIndex } = props.findIssue(overId);
			props.moveIssue(draggedId, overIndex);
		}
	},
}



class Issue extends Component {
  constructor(props) {
    super(props);
    this.markdownConverter = new showdown.Converter();
  }

  issueBody(issue) {
    // This is dangerous and needs to revisted to make sure it is safe
    // I am doing this so we can render markup sent from github
    return (
      <div
        className="Box-body markdown-body"
        dangerouslySetInnerHTML={{
          __html: this.markdownConverter.makeHtml(issue.body) || '<em>No description provided<em>'
        }}
      />
    );
  }

  render() {
    const {
			text,
			isDragging,
			connectDragSource,
			connectDropTarget,
		} = this.props

    return connectDragSource(
      connectDropTarget(
        <div
          key={this.props.issue.id}
          className="Box issue">
          <div className="Box-header">
            <h3 className="Box-title">
              {this.props.issue.title}
            </h3>
          </div>
          {this.issueBody(this.props.issue)}
          <div className="Box-footer">
            <a href={this.props.issue.html_url}>
              Edit Issue
            </a>
          </div>
        </div>
      )
    );
  }
}

const dropTargetIssue = DropTarget('issue', issueTarget, connect => ({
	connectDropTarget: connect.dropTarget(),
}))(Issue);

export default DragSource('issue', issueSource, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging(),
}))(dropTargetIssue)