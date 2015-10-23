import React from 'react';
import {IndexRoute, Route} from 'react-router';

import ViewerQueries from './queries/ViewerQueries';

import TodoApp from './components/TodoApp';
import TodoList from './components/TodoList';
import App from './components/App';

export default (
  <Route
    path="/" component={App}
  >
    <IndexRoute
      component={TodoList}
      queries={ViewerQueries}
      prepareParams={() => ({status: 'any'})}
    />
    <Route
      path=":status" component={TodoList}
      queries={ViewerQueries}
    />
  </Route>
);
