"use strict";
/*
 * All events from token sale
 *
 * * Author: Pankaj
 * * Date: 11/09/2018
 * * Reviewed by: Aniket
 */

const rootPrefix = '../..'
  , coreAddresses = require(rootPrefix + '/config/core_addresses')
  , updateWhitelistKlass = require(rootPrefix + '/events/whitelisting/whitelist_updated')
  , mailer = require(rootPrefix + '/helpers/application_mailer')
;

let retryCount = 1;

let web3Obj = undefined
  , timeoutObj = undefined
;

function setWeb3Obj(web3) {
  web3Obj = web3;
}

function clearTimeoutObject() {
  console.log("clearing timeout object");
  clearTimeout(timeoutObj);
}

async function getWhitelistAddresses() {
  const whitelistContractAddresses = await coreAddresses.getGenericWhitelistContractAddresses();
  let timeoutTime = 21600000; //6 hours

  if (whitelistContractAddresses === undefined) {
    if (retryCount < 10) {
      timeoutTime = 10000 * retryCount; // 10 seconds
      retryCount++;

    } else {
      const bodyText = "Fetching generic whitelist contract address reached its maximum retry count(" + retryCount + "). It " +
        "may occur due to unreachable SimpleTokenAPI or response from SimpleTokenAPI may not same as desired.";
      mailer.perform({
        subject: 'getGenericWhitelistContractAddresses :: Max retry count reached',
        body: bodyText
      });

      retryCount = 1;
    }
  } else {
    retryCount = 1;
    if (web3Obj) {
      updateWhitelistKlass.updateWhitelist(whitelistContractAddresses, web3Obj);
    } else {
      console.log(" WS Provider is not set.");
      const bodyText = "Web Socket connection was not provided, during subscription of whitelisting events.";
      mailer.perform({
        subject: 'getGenericWhitelistContractAddresses :: Web Socket connection issue',
        body: bodyText
      });
    }
  }
  clearTimeoutObject();
  console.log("Try after : " + timeoutTime);
  timeoutObj = setTimeout(getWhitelistAddresses, timeoutTime);
}

const whitelistingEvents = {

  subscribe: async function (web3Obj) {
    setWeb3Obj(web3Obj);

    getWhitelistAddresses();
  },

  onUnsubscribed: function () {
    updateWhitelistKlass.clearSubscriptions();
  }

};

module.exports = whitelistingEvents;
