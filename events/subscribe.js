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
    require('./token_sale/all')
    ,require('./future_token_sale_lock_box/all')
    ,require('./simple_token/all')
    ,require('./trustee/all')
    // ,require('./presales/all')
    // ,require('./grantable_allocations/all')
    ,require('./whitelisting/all')
];

const getWScallback = function(provider){
    provider.on('connect', () => {console.log('WS Connected');
        console.log(" Go for Event subscription.");
        subscribeAllEvents(Web3Provider.getSocketConnection());
    });
    provider.on('end', e => {
        console.log("WS Disconnected");
        onUnsubscribed();
        setTimeout(getWSProvider, 10000);
    });
};

function getWSProvider(){
  Web3Provider.getWsProvider(getWScallback);
}

async function subscribeAllEvents(web3WsProvider){
  for(let i = 0; i < eventsToSubscribe.length; i ++) {
    let eventKlass = eventsToSubscribe[i];
    eventKlass.subscribe(web3WsProvider);
  }
}

function onUnsubscribed(){
  for(let i = 0; i < eventsToSubscribe.length; i ++) {
    let eventKlass = eventsToSubscribe[i];
    eventKlass.onUnsubscribed();
  }
}

getWSProvider();