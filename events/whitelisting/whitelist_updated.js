"use strict";
/*
 * WhitelistUpdated event from TokenSale Contract
 *
 * * Author: Kedar
 * * Date: 26/10/2017
 * * Reviewed by: Sunil
 */

const rootPrefix = '../..'
  , web3WsProvider = require(rootPrefix + '/lib/web3/ws_provider')
  , coreAddresses = require(rootPrefix + '/config/core_addresses')
  , stApi = require(rootPrefix + '/lib/request/st_api')
;

const genericWhitelist = 'genericWhitelist'
;

let subscriptionObjs = {};

const eventCB = function (e, res) {
  console.log('WhitelistUpdated received for contract: ', res.address);

  if (e) {
    console.error('### WhitelistUpdated error for contract: ', res.address);
    console.error(e);
    return;
  }
  const eventArgs = res.returnValues;

  const eventsData = [
    {
      name: res.event,
      events: [
        {
          name: "_account",
          type: "address",
          value: eventArgs['_account']
        },
        {
          name: "_phase",
          type: "uint8",
          value: eventArgs['_phase']
        }
      ],
      address: res.address
    }
  ];

  stApi.sendWhitelistConfirmation({
    transaction_hash: res.transactionHash,
    block_hash: res.blockHash,
    block_number: res.blockNumber,
    events_data: eventsData
  });
};

const whiteListFuncitons = {

  getGenericWhitelistABI: function () {
    return coreAddresses.getAbiForContract(genericWhitelist)
  },

  getAddresses: function (superSet, set) {
    if (superSet === undefined || set === undefined) {
      return superSet
    }

    const newSet = [];
    superSet.forEach(function (val, index) {
      if (!set.includes(val)) {
        newSet.push(val);
      }
    });

    return newSet;
  },

  updateWhitelist: async function (whitelistContractAddresses) {
    let oThis = this;

    whitelistContractAddresses.forEach(function (val,index) {
      let checkSumVal = web3WsProvider.utils.toChecksumAddress(val);
      whitelistContractAddresses[index] = checkSumVal
    });
    

    const removeListenerAddresses = oThis.getAddresses(Object.keys(subscriptionObjs), whitelistContractAddresses)
      , addListenerAddresses = oThis.getAddresses(whitelistContractAddresses, Object.keys(subscriptionObjs))
    ;

    if (removeListenerAddresses && removeListenerAddresses.length > 0) {
      removeListenerAddresses.forEach(function (address, index) {
        const subscriptionObj = subscriptionObjs[address];
        subscriptionObj.unsubscribe(function (error, success) {
          if (success) {
            console.log('Successfully unsubscribed!');
            delete subscriptionObjs[address]
          }
        });
      });
    }

    if (addListenerAddresses && addListenerAddresses.length > 0) {
      const whitelistContractAbi = oThis.getGenericWhitelistABI();

      for (let i = 0; i < addListenerAddresses.length; i++) {
        const whitelistContractAddress = addListenerAddresses[i];
        let genericWhitelistContract = await new web3WsProvider.eth.Contract(whitelistContractAbi, whitelistContractAddress);
        // Listen to WhitelistUpdated event
        let val = genericWhitelistContract.events.WhitelistUpdated({}, eventCB);
        subscriptionObjs[whitelistContractAddress] = val
      }
    }

  },
};

module.exports = whiteListFuncitons;