"use strict";
/*
 * Subscribe to all the relevant events
 *
 * * Author: Pankaj
 * * Date: 12/10/2018
 * * Reviewed by:
 */

const rootPrefix = '..'
  , Web3Provider = require(rootPrefix + '/lib/web3/ws_provider')
  , mailer = require(rootPrefix + '/helpers/application_mailer')
;

// Events to subscribe now
// Add in below array to Subscribe events.
const retryTimeInterval = 3000
  , maxAllowedRetry = 7
  , eventsToSubscribe = [
     require(rootPrefix + '/events/whitelisting/all')
  ]
;

let retryCount = 0,
  eventsSubscribed = false
;

function subscribeAllEvents(web3Obj) {
  for (let i = 0; i < eventsToSubscribe.length; i++) {
    let eventKlass = eventsToSubscribe[i];
    console.log("WSProvider ->  Subscribing events for:", eventKlass);
    eventKlass.subscribe(web3Obj);
  }
}

function sendEmail() {
  mailer.perform({
    subject: 'IMPORTANT - Subscribe :: Max retry count reached',
    body: "There issue in subscribe event."
  });
}

process.on('wsProviderConnect', () => {
  console.log("WSProvider -> subscribe :: Event received: wsProviderConnect.");
  subscriptionHelper.processSubscription();
});

process.on('wsProviderEnd', () => {
  eventsSubscribed = false;
  console.log("WSProvider -> subscribe :: Event received: wsProviderEnd.");

  if (retryCount == maxAllowedRetry) {
    console.log("WSProvider -> subscribe :: Max retry reached.");
    retryCount = 0;
    sendEmail();

  } else {
    retryCount++;
    let retryTimestamp = retryTimeInterval * retryCount;
    console.log("WSProvider -> Provider is not connected. retryCount:", retryCount, ", retrying after: ", retryTimestamp, " seconds.");
    setTimeout(subscriptionHelper.processSubscription, retryTimestamp);
  }

});

const subscriptionHelper = {
  processSubscription: function () {
    if (!eventsSubscribed ) {
      const web3Obj = Web3Provider.getWeb3();

      if (Web3Provider.isConnected()) {
        eventsSubscribed = true;
        console.log("WSProvider -> Provider connected. retry attempt:", retryCount);
        retryCount = 0;
        subscribeAllEvents(web3Obj);
      }
    }
  }
};

module.exports = subscriptionHelper;