"use strict";
/*
 * WhitelistUpdated event from TokenSale Contract
 *
 * * Author: Kedar
 * * Date: 26/10/2017
 * * Reviewed by: Sunil
 */

const rootPrefix = '../..'
  , coreAddresses = require(rootPrefix + '/config/core_addresses')
  , stApi = require(rootPrefix + '/lib/request/st_api')
  , wsProvider = require(rootPrefix + '/lib/web3/ws_provider')
;

const genericWhitelist = 'genericWhitelist'
;

let subscriptionObjs = {};

const eventCB = function (e, res) {

  if (e) {
    console.error('### Whitelist Contract subscription error.');
    console.error(e);
    return;
  }

  console.log('WhitelistUpdated received for contract: ', res.address);
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

process.on('wsProviderEnd', () => {
  console.log("whitelist_updated :: Event received: wsProviderEnd.");
  whiteListFunctions.clearSubscriptions();
});

const whiteListFunctions = {

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

  updateWhitelist: async function (whitelistContractAddresses, web3Obj) {
    let oThis = this;

    whitelistContractAddresses.forEach(function (val, index) {
      let checkSumVal = web3Obj.utils.toChecksumAddress(val);
      whitelistContractAddresses[index] = checkSumVal
    });


    const removeListenerAddresses = oThis.getAddresses(Object.keys(subscriptionObjs), whitelistContractAddresses)
      , addListenerAddresses = oThis.getAddresses(whitelistContractAddresses, Object.keys(subscriptionObjs))
    ;

    console.log("already subscribed contract addresses: ", Object.keys(subscriptionObjs),
      "\nreceived whitelistContractAddresses :", whitelistContractAddresses,
      "\nunsubscribe Addresses : ", removeListenerAddresses,
      "\nsubscribe Addresses :", addListenerAddresses);

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

    if (web3Obj && wsProvider.isConnected() && addListenerAddresses && addListenerAddresses.length > 0) {
      const whitelistContractAbi = oThis.getGenericWhitelistABI();

      for (let i = 0; i < addListenerAddresses.length; i++) {
        const whitelistContractAddress = addListenerAddresses[i];
        let genericWhitelistContract = await new web3Obj.eth.Contract(whitelistContractAbi, whitelistContractAddress);
        // Listen to WhitelistUpdated event
        let val = genericWhitelistContract.events.WhitelistUpdated({}, eventCB);
        subscriptionObjs[whitelistContractAddress] = val
      }
    }
  },

  clearSubscriptions: function () {
    let oThis = this;

    oThis.updateWhitelist([],);
    subscriptionObjs = {}
  }
};

module.exports = whiteListFunctions;