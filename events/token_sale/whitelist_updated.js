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

const genericWhitelistContractAbi = coreAddresses.getAbiForContract('genericWhitelist')
  , genericWhitelistContractAddresses = coreAddresses.getAddressesForContract('genericWhitelist')
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

for (var i = 0; i < genericWhitelistContractAddresses.length; i++) {
  var genericWhitelistContract = new web3WsProvider.eth.Contract(genericWhitelistContractAbi, genericWhitelistContractAddresses[i]);

  // Listen to WhitelistUpdated event
  genericWhitelistContract.events.WhitelistUpdated({}, eventCB);
}