"use strict";
/*
 * Subscribe to all the relevant events
 *
 * * Author: Pankaj
 * * Date: 12/10/2018
 * * Reviewed by:
 */

const rootPrefix = '..',
    Web3Provider = require(rootPrefix + '/lib/web3/ws_provider');

// Events to subscribe now
// Add in below array to Subscribe events.
const eventsToSubscribe = [
    require(rootPrefix + '/events/token_sale/all')
    ,require(rootPrefix + '/events/future_token_sale_lock_box/all')
    ,require(rootPrefix + '/events/simple_token/all')
    ,require(rootPrefix + '/events/trustee/all')
    // ,require(rootPrefix + '/events/presales/all')
    // ,require(rootPrefix + '/events/grantable_allocations/all')
    ,require(rootPrefix + '/events/whitelisting/all')
];

const getWScallback = function(provider){
    provider.on('connect', () => {console.log('WS Connected');
        console.log(" Go for Event subscription.");
        subscribeAllEvents(Web3Provider.getSocketConnection());
    });
    provider.on('end', e => {
        console.log("WS Disconnected");
        onUnsubscribed();
        setTimeout(getWSProvider, 5000);
    });
};

function getWSProvider(){
  Web3Provider.getWsProvider(getWScallback);
};

function subscribeAllEvents(web3WsProvider){
  for(let i = 0; i < eventsToSubscribe.length; i ++) {
    let eventKlass = eventsToSubscribe[i];
    eventKlass.subscribe(web3WsProvider);
  }
};

function onUnsubscribed(){
  for(let i = 0; i < eventsToSubscribe.length; i ++) {
    let eventKlass = eventsToSubscribe[i];
    eventKlass.onUnsubscribed();
  }
};

getWSProvider();