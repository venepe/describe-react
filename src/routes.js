'use strict';

import React from 'react';
import {IndexRoute, Route} from 'react-router';

import App from './components/App';
import HomeView from './components/HomeView';
import ProjectView from './components/ProjectView';
import SpinnerView from './components/SpinnerView';
import MyProjectsView from './components/MyProjectsView';
import FailureView from './components/FailureView';
import TestCaseView from './components/TestCaseView';
import CoverImageView from './components/CoverImageView';
import ExampleImageView from './components/ExampleImageView';
import FulfillmentImageView from './components/FulfillmentImageView';
import MeView from './components/MeView';
import ResetForm from './components/ResetForm';

import ProjectRoute from './routes/ProjectRoute';
import ProjectQueries from './queries/ProjectQueries';
import TestCaseQueries from './queries/TestCaseQueries';
import CoverImageQueries from './queries/CoverImageQueries';
import ExampleQueries from './queries/ExampleQueries';
import FulfillmentQueries from './queries/FulfillmentQueries';
import MeQueries from './queries/MeQueries';

import SMTIStorage from './utils/storage';
import Authenticate from './utils/authenticate';

function requireAuth(nextState, replaceState) {
  let isLoggedIn = Authenticate.isLoggedIn();
  if (!isLoggedIn && nextState.location.pathname !== '/') {
    replaceState({ nextPathname: nextState.location.pathname }, '/')
  } else if (isLoggedIn && nextState.location.pathname === '/') {
    replaceState({ nextPathname: nextState.location.pathname }, '/myprojects')
  }
}

function prepareParams(params, route) {
  return {
    ...params,
    meId: SMTIStorage.getMeIdFromLocalStorage()
  };
};

export default (
  <Route
    path="/" component={App}
  >
    <IndexRoute
      component={HomeView}
      onEnter={requireAuth}
    />
    <Route
        path="reset" component={ResetForm}
      />
    <Route
        path="me" component={MeView}
        queries={MeQueries}
        prepareParams={() => ({meId: SMTIStorage.getMeIdFromLocalStorage() })}
        renderLoading={() => <SpinnerView />}
        renderFailure={(error, retry) => <FailureView error={error} retry={retry} />}
        onEnter={requireAuth}
      />
    <Route
        path="myprojects" component={MyProjectsView}
        queries={MeQueries}
        prepareParams={() => ({meId: SMTIStorage.getMeIdFromLocalStorage() })}
        renderLoading={() => <SpinnerView />}
        renderFailure={(error, retry) => <FailureView error={error} retry={retry} />}
        onEnter={requireAuth}
      />
    <Route
        path="projects/:projectId" component={ProjectView}
        queries={ProjectQueries}
        prepareParams={(params) => ({meId: SMTIStorage.getMeIdFromLocalStorage(), projectId: params.projectId })}
        renderLoading={() => <SpinnerView />}
        renderFailure={(error, retry) => <FailureView error={error} retry={retry} />}
        onEnter={requireAuth}
      />
    <Route
        path="projects/:projectId/testCases/:testCaseId" component={TestCaseView}
        queries={TestCaseQueries}
        renderLoading={() => <SpinnerView />}
        renderFailure={(error, retry) => <FailureView error={error} retry={retry} />}
        onEnter={requireAuth}
      />
    <Route
        path="*/:targetId/examples/:exampleId" component={ExampleImageView}
        queries={ExampleQueries}
        renderLoading={() => <SpinnerView />}
        renderFailure={(error, retry) => <FailureView error={error} retry={retry} />}
        onEnter={requireAuth}
      />
    <Route
        path="*/:targetId/coverImages/:coverImageId" component={CoverImageView}
        queries={CoverImageQueries}
        renderLoading={() => <SpinnerView />}
        renderFailure={(error, retry) => <FailureView error={error} retry={retry} />}
        onEnter={requireAuth}
      />
    <Route
        path="*/testCases/:testCaseId/fulfillments/:fulfillmentId" component={FulfillmentImageView}
        queries={FulfillmentQueries}
        renderLoading={() => <SpinnerView />}
        renderFailure={(error, retry) => <FailureView error={error} retry={retry} />}
        onEnter={requireAuth}
      />
  </Route>
);
