import React from 'react';
import {IndexRoute, Route} from 'react-router';

import App from './components/App';
import ProjectView from './components/ProjectView';
import ProjectRoute from './routes/ProjectRoute';
import ProjectQueries from './queries/ProjectQueries';

export default (
  <Route
    path="/" component={App}
  >
    <IndexRoute
      component={App}
    />
    <Route
        path="projects/:projectId" component={ProjectView}
        queries={ProjectQueries}
      />
  </Route>
);
