'use strict';

import React from 'react';
import {IndexRoute, Route} from 'react-router';

import App from './components/App';
import HomeView from './components/HomeView';
import SpinnerView from './components/SpinnerView';
import MyProjectsView from './components/MyProjectsView';
import MyInvitationsView from './components/MyInvitationsView';
import FailureView from './components/FailureView';
import TestCaseListPage from './components/TestCaseListPage';
import TestCasePage from './components/TestCasePage';
import CoverImageView from './components/CoverImageView';
import FileImageView from './components/FileImageView';
import MeView from './components/MeView';
import UserView from './components/UserView';
import ResetForm from './components/ResetForm';
import ProjectEventListPage from './components/ProjectEventListPage';
import TestCaseEventListPage from './components/TestCaseEventListPage';
import FulfillmentEventListPage from './components/FulfillmentEventListPage';
import CollaboratorListPage from './components/CollaboratorListPage';
import InviteeListPage from './components/InviteeListPage';
import MessageListPage from './components/MessageListPage';

import {
  ChannelQueries,
  CollaborationQueries,
  CoverImageQueries,
  FileQueries,
  FulfillmentQueries,
  MeQueries,
  ProjectQueries,
  TestCaseQueries,
  UserQueries
} from './queries';

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
        path="myinvitations" component={MyInvitationsView}
        queries={MeQueries}
        prepareParams={() => ({meId: SMTIStorage.getMeIdFromLocalStorage() })}
        renderLoading={() => <SpinnerView />}
        renderFailure={(error, retry) => <FailureView error={error} retry={retry} />}
        onEnter={requireAuth}
      />
    <Route
        path="projects/:projectId/testCases" component={TestCaseListPage}
        queries={ProjectQueries}
        prepareParams={(params) => ({meId: SMTIStorage.getMeIdFromLocalStorage(), projectId: params.projectId })}
        renderLoading={() => <SpinnerView />}
        renderFailure={(error, retry) => <FailureView error={error} retry={retry} />}
        onEnter={requireAuth}
      />
    <Route
        path="projects/:projectId/events" component={ProjectEventListPage}
        queries={ProjectQueries}
        prepareParams={(params) => ({meId: SMTIStorage.getMeIdFromLocalStorage(), projectId: params.projectId })}
        renderLoading={() => <SpinnerView />}
        renderFailure={(error, retry) => <FailureView error={error} retry={retry} />}
        onEnter={requireAuth}
      />
    <Route
        path="projects/:projectId/collaborators" component={CollaboratorListPage}
        queries={ProjectQueries}
        prepareParams={(params) => ({meId: SMTIStorage.getMeIdFromLocalStorage(), projectId: params.projectId })}
        renderLoading={() => <SpinnerView />}
        renderFailure={(error, retry) => <FailureView error={error} retry={retry} />}
        onEnter={requireAuth}
      />
    <Route
        path="projects/:projectId/invitees" component={InviteeListPage}
        queries={ProjectQueries}
        prepareParams={(params) => ({meId: SMTIStorage.getMeIdFromLocalStorage(), projectId: params.projectId })}
        renderLoading={() => <SpinnerView />}
        renderFailure={(error, retry) => <FailureView error={error} retry={retry} />}
        onEnter={requireAuth}
      />
    <Route
        path="channels/:channelId/messages" component={MessageListPage}
        queries={ChannelQueries}
        renderLoading={() => <SpinnerView />}
        renderFailure={(error, retry) => <FailureView error={error} retry={retry} />}
        onEnter={requireAuth}
      />
    <Route
        path="users/:userId" component={UserView}
        queries={UserQueries}
        renderLoading={() => <SpinnerView />}
        renderFailure={(error, retry) => <FailureView error={error} retry={retry} />}
        onEnter={requireAuth}
      />
    <Route
        path="projects/:projectId/testCases/:testCaseId" component={TestCasePage}
        queries={TestCaseQueries}
        renderLoading={() => <SpinnerView />}
        renderFailure={(error, retry) => <FailureView error={error} retry={retry} />}
        onEnter={requireAuth}
      />
    <Route
        path="projects/:projectId/testCases/:testCaseId/events" component={TestCaseEventListPage}
        queries={TestCaseQueries}
        renderLoading={() => <SpinnerView />}
        renderFailure={(error, retry) => <FailureView error={error} retry={retry} />}
        onEnter={requireAuth}
      />
    <Route
        path="*/:targetId/files/:fileId" component={FileImageView}
        queries={FileQueries}
        renderLoading={() => <SpinnerView />}
        renderFailure={(error, retry) => <FailureView error={error} retry={retry} />}
        onEnter={requireAuth}
      />
    <Route
        path="*/:userId/coverImages/:coverImageId" component={CoverImageView}
        queries={CoverImageQueries}
        renderLoading={() => <SpinnerView />}
        renderFailure={(error, retry) => <FailureView error={error} retry={retry} />}
        onEnter={requireAuth}
      />
    <Route
        path="projects/:projectId/testCases/:testCaseId/fulfillments/:fulfillmentId/events" component={FulfillmentEventListPage}
        queries={FulfillmentQueries}
        renderLoading={() => <SpinnerView />}
        renderFailure={(error, retry) => <FailureView error={error} retry={retry} />}
        onEnter={requireAuth}
      />
  </Route>
);
