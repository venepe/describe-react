'use strict';

class SocketIONetworkLayer {

  constructor(socket, token) {
    this.socket = socket;

    this.queries = {};
    this.socket.on('graphql/query/response', payload => this.handleQuery(payload));

    this.mutationId = 0;
    this.mutations = {};
    this.socket.on('graphql/mutation/response', payload => this.handleMutation(payload));

    this.subscriptionId = 0;
    this.subscriptions = {};
    this.socket.on('graphql/subscription/response', payload => this.handleSubscription(payload));
  }

  sendMutation(mutationRequest) {
    const id = this.mutationId++;
    const files = [];
    this.mutations[id] = mutationRequest;
    this.socket.emit('graphql/mutation', {
      id,
      token,
      query: mutationRequest.getQueryString(),
      variables: mutationRequest.getVariables(),
      files: mutationRequest.getFiles()
    });
  }

  sendQueries(queryRequests) {
    queryRequests.forEach(request => {
      this.queries[request.getID()] = request;
    });

    this.socket.emit('graphql/queries', queryRequests.map(request => ({
      id: request.getID(),
      token,
      query: request.getQueryString(),
      variables: request.getVariables()
    })));
  }

  sendSubscription(subscriptionRequest) {
    const id = this.subscriptionId++;
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

  handleQuery(payload) {
    const request = this.queries[payload.id];
    delete this.queries[payload.id];

    if (payload.errors) {
      request.reject(payload.errors[0]);
    } else if (!payload.data) {
      request.reject(new Error('Server response was missing `data`.'));
    } else {
      request.resolve({response: payload.data});
    }
  }

  handleMutation(payload) {
    const request = this.mutations[payload.id];
    delete this.mutations[payload.id];

    if (payload.errors) {
      request.reject(payload.errors[0]);
    } else if (!payload.data) {
      request.reject(new Error('Server response was missing `data`.'));
    } else {
      request.resolve({response: payload.data});
    }
  }

  handleSubscription(payload) {
    const request = this.subscriptions[payload.id];
    if (request) {
      if (payload.errors) {
        request.onError(payload.errors);
      } else if (!payload.data) {
        request.onError('Server response was missing `data`.');
      } else {
        request.onNext({response: payload.data});
      }
    }
  }
}

export default SocketIONetworkLayer;
