'use strict';

import Relay from 'react-relay';

export const ChannelQueries = {
  channel: () => Relay.QL`
    query {
      node(id: $channelId)
    }
  `
}
