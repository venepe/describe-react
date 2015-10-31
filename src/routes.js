'use strict';

import React from 'react';
import {IndexRoute, Route} from 'react-router';

import App from './components/App';
import ProjectView from './components/ProjectView';
import SpinnerView from './components/SpinnerView';
import MyProjectsView from './components/MyProjectsView';
import FailureView from './components/FailureView';
import TestCaseView from './components/TestCaseView';
import PaperView from './components/PaperView';
import ImageView from './components/ImageView';

import ProjectRoute from './routes/ProjectRoute';
import ProjectQueries from './queries/ProjectQueries';
import TestCaseQueries from './queries/TestCaseQueries';SMTIStorage.getMeIdFromLocalStorage()
import PaperQueries from './queries/PaperQueries';
import ImageQueries from './queries/ImageQueries';
import MeQueries from './queries/MeQueries';

import SMTIStorage from './utils/storage';

export default (
  <Route
    path="/" component={App}
  >
    <IndexRoute
      component={App}
    />
    <Route
        path="myprojects" component={MyProjectsView}
        queries={MeQueries}
        prepareParams={() => ({meId: SMTIStorage.getMeIdFromLocalStorage() })}
        renderLoading={() => <SpinnerView />}
        renderFailure={(error, retry) => <FailureView error={error} retry={retry} />}
      />
    <Route
        path="projects/:projectId" component={ProjectView}
        queries={ProjectQueries}
        renderLoading={() => <SpinnerView />}
        renderFailure={(error, retry) => <FailureView error={error} retry={retry} />}
      />
    <Route
        path="testCases/:testCaseId" component={TestCaseView}
        queries={TestCaseQueries}
        renderLoading={() => <SpinnerView />}
        renderFailure={(error, retry) => <FailureView error={error} retry={retry} />}
      />
    <Route
        path="papers/:paperId" component={PaperView}
        queries={PaperQueries}
        renderLoading={() => <SpinnerView />}
        renderFailure={(error, retry) => <FailureView error={error} retry={retry} />}
      />
    <Route
        path="images/:imageId" component={ImageView}
        queries={ImageQueries}
        renderLoading={() => <SpinnerView />}
        renderFailure={(error, retry) => <FailureView error={error} retry={retry} />}
      />
  </Route>
);
