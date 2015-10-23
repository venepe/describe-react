/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import styles from './ProjectView.css';
import { Paper } from 'material-ui';
import Archy from '../Archy';
import ProjectCoverImage from '../ProjectCoverImage';

import DeleteTestCaseMutation from '../../mutations/DeleteTestCaseMutation';
import DeleteImageMutation from '../../mutations/DeleteImageMutation';
import DeletePaperMutation from '../../mutations/DeletePaperMutation';
import DeleteProjectMutation from '../../mutations/DeleteProjectMutation';

class ProjectView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let object = {};
    if (this.props.project) {
      console.log(this.props.project.id);
      console.log(this.props.project.title);
      object = {
        component: (<div>describe:</div>),
        nodes: [
          {
            component: (<div id={this.props.project.id}>{this.props.project.title}</div>),
            nodes: []
          }
        ]
      }
    }

    return (
      <div className="ProjectView-container">
        <Archy archible={object}/>
      </div>
    );
  }
}

var ProjectViewContainer = Relay.createContainer(ProjectView, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        id
        title
        testCases(first: 10) {
          edges {
            node {
              id
              it
              ${DeleteTestCaseMutation.getFragment('testCase')},
            }
          }
        }
        images(first: 10) {
          edges {
            node {
              id
              uri
              ${DeleteImageMutation.getFragment('image')},
            }
          }
        }
        papers(first: 10) {
          edges {
            node {
              id
              text
              ${DeletePaperMutation.getFragment('paper')},
            }
          }
        }
        ${ProjectCoverImage.getFragment('projectCoverImage')},
        ${DeleteTestCaseMutation.getFragment('project')},
        ${DeleteImageMutation.getFragment('target')},
        ${DeletePaperMutation.getFragment('target')},
        ${DeleteProjectMutation.getFragment('project')},
      }
    `,
  },
});



export default ProjectViewContainer;
