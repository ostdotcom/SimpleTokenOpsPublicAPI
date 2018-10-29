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
  , updateWhitelistKlass = require(rootPrefix + '/events/whitelisting/whitelist_updated')
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

function subscribeAllEvents() {
  for (let i = 0; i < eventsToSubscribe.length; i++) {
    let eventKlass = eventsToSubscribe[i];
    eventKlass.subscribe();
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
  retryCount = 0;
  subscriptionHelper.processSubscription();
});

process.on('wsProviderEnd', () => {
  eventsSubscribed = false;
  console.log("WSProvider -> subscribe :: Event received: wsProviderEnd.");

  updateWhitelistKlass.clearSubscriptions();
  if (retryCount == maxAllowedRetry) {
    console.log("WSProvider -> subscribe :: Max retry reached.");
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
    console.log("WSProvider -> subscribe::processSubscription");
    if (!eventsSubscribed ) {
      const web3Obj = Web3Provider.getWeb3WithProvider();

      if (Web3Provider.isConnected(web3Obj)) {
        eventsSubscribed = true;
        console.log("WSProvider -> Provider connected. retry attempt:", retryCount);
        retryCount = 0;
        subscribeAllEvents();
      }
    }
  }
};

module.exports = subscriptionHelper;