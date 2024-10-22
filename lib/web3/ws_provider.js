"use strict";
/*
 * Web3 WS provider
 *
 * * Author: Kedar
 * * Date: 23/10/2017
 * * Reviewed by: Sunil
 */

const rootPrefix = '../..'
  , coreConstants = require(rootPrefix + '/config/core_constants')
;

const Web3 = require('web3');

let wsProvider;
const getWsProvider = function () {

  if (wsProvider && wsProvider.connection._connection) {
    if (wsProvider.connection._connection.connected) {
      return wsProvider;
    }
  }

  if (wsProvider) {
    wsProvider.connection.close();
    wsProvider = undefined;
  }
  console.log("WSProvider -> creating new provider");
  wsProvider = new Web3.providers.WebsocketProvider(coreConstants.ST_GETH_WS_PROVIDER);

  wsProvider.on('connect', () => {
    console.log('WSProvider -> WS Connected');
    process.emit('wsProviderConnect')
  });
  wsProvider.on('end', e => {
    console.log("WSProvider -> WS Disconnected");
    process.emit('wsProviderEnd')
  });

  return wsProvider;
};

const web3Helper = {

  getWeb3WithProvider: function () {
    return (new Web3(getWsProvider()));
  },

  getWeb3WithoutProvider: function () {
    return (new Web3());
  },

  isConnected: function (web3Obj) {
    const currentProvider = web3Obj.currentProvider;
    if (currentProvider && currentProvider.connection._connection) {
      return currentProvider.connection._connection.connected
    }
    return false;
  }
};

module.exports = web3Helper;