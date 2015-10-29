'use strict';

import React from 'react';
import {IndexRoute, Route} from 'react-router';

import App from './components/App';
import ProjectView from './components/ProjectView';
import LoginView from './components/LoginView';
import SpinnerView from './components/SpinnerView';
import MyProjectsView from './components/MyProjectsView';
import FailureView from './components/FailureView';
import ProjectRoute from './routes/ProjectRoute';
import ProjectQueries from './queries/ProjectQueries';

import ProjectForm from './components/ProjectForm';

export default (
  <Route
    path="/" component={App}
  >
    <IndexRoute
      component={App}
    />
    <Route
        path="login" component={LoginView}
      />
      <Route
          path="form" component={ProjectForm}
        />
    <Route
        path="myprojects" component={MyProjectsView}
      />
    <Route
        path="projects/:projectId" component={ProjectView}
        queries={ProjectQueries}
        renderLoading={() => <SpinnerView />}
        renderFailure={(error, retry) => <FailureView error={error} retry={retry} />}
      />
  </Route>
);
