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
  , coreAddresses = require('../../config/core_addresses')
  , stApi = require(rootPrefix + '/lib/request/st_api')
  , genericWhitelist = 'genericWhitelist'
  ;

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

  getGenericWhitelistABI: function (){
    return coreAddresses.getAbiForContract(genericWhitelist)
  },

  getGenericWhitelistContractAddresses : async function (){
    const contractAddresses = await coreAddresses.getGenericWhitelistContractAddresses();
    return Promise.resolve(contractAddresses);
  },

  updateWhitelist : async function () {
    let oThis = this;
    const whitelistContractAddressesPromise = await oThis.getGenericWhitelistContractAddresses()
      , whitelistContractAddresses = whitelistContractAddressesPromise.data['contract_addresses']
    ;
    const whitelistContractAbi = oThis.getGenericWhitelistABI();

    for (let i = 0; i < whitelistContractAddresses.length; i++) {
      let genericWhitelistContract = new web3WsProvider.eth.Contract(whitelistContractAbi, whitelistContractAddresses[i]);

      // Listen to WhitelistUpdated event
      genericWhitelistContract.events.WhitelistUpdated({}, eventCB);
    }
  },
};

module.exports = whiteListFuncitons;