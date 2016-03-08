'use strict';

import Relay from 'react-relay';
import { SMTIGraphQLUrl } from '../constants';

class SMTIDefaultNetworkLayer {

  constructor(socket, token) {
    this.socket = socket;
    this.token = token;

    this.subscriptionId = 0;
    this.subscriptions = {};
    this.socket.on('graphql/subscription/response', payload => this.handleSubscription(payload));

    this.SMTIDefaultNetworkLayer = new Relay.DefaultNetworkLayer(SMTIGraphQLUrl, {
      headers: {
        'x-smti-authorization': token
      }
    });
  }

  sendMutation(mutationRequest) {
    return this.SMTIDefaultNetworkLayer.sendMutation(mutationRequest);
  }

  sendQueries(queryRequests) {
    return this.SMTIDefaultNetworkLayer.sendQueries(queryRequests);
  }

  sendSubscription(subscriptionRequest) {
    const id = this.subscriptionId++;
    const token = this.token;

    this.subscriptions[id] = subscriptionRequest;
    this.socket.emit('graphql/subscription', {
      id,
      token,
      query: subscriptionRequest.getQueryString(),
      variables: subscriptionRequest.getVariables()
    });

    return {
      dispose: () => {
        this.socket.emit('graphql/subscription/unsubscribe', {id});
        delete this.subscriptions[id];
      }
    }
  }

  supports(...options) {
    return false;
  }

  handleSubscription(payload) {
    const request = this.subscriptions[payload.id];
    if (request) {
      if (payload.errors) {
        request.onError(payload.errors);
      } else if (!payload.data) {
        request.onError('Server response was missing `data`.');
      } else {
        console.log(payload.data);
        request.onNext({response: payload.data});
      }
    }
  }
}

export default SMTIDefaultNetworkLayer;
