"use strict";
/*
 * Web3 WS provider
 *
 * * Author: Kedar
 * * Date: 23/10/2017
 * * Reviewed by: Sunil
 */

const rootPrefix = '.',
coreConstants = require(rootPrefix + '/config/core_constants');

const Web3 = require('web3');

const wsProvider = {

  getWsProvider: function(callback){
      const provider = new Web3.providers.WebsocketProvider(coreConstants.ST_GETH_WS_PROVIDER);

      if(callback){
        callback(provider);
      }
      return provider;
  },

  getSocketConnection: function(){
      const oThis = this;
      return (new Web3(oThis.getWsProvider()));
  }
};

module.exports = wsProvider;