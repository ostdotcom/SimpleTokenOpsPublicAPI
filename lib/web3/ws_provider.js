"use strict";
/*
 * Web3 WS provider
 *
 * * Author: Kedar
 * * Date: 23/10/2017
 * * Reviewed by: Sunil
 */

const coreConstants = require('../../config/core_constants'),
    eventSubscription = require('../../events/subscribe');

const Web3 = require('web3');

let reSubscribeEvents = false;


function getProvider(){
  const provider = new Web3.providers.WebsocketProvider(coreConstants.ST_GETH_WS_PROVIDER);
  provider.on('connect', () => {console.log('WS Connected');
    if(reSubscribeEvents){
      console.log("Go for events Resubscription");
      eventSubscription.reSubscribe();
    }
  });
  provider.on('end', e => {
    console.log("WS End");
    reSubscribeEvents = true;
    setTimeout(Web3.setProvider(getProvider()), 10000);
  });

  return provider;
}

const web3WsProvider = new Web3(getProvider());

module.exports = web3WsProvider;