"use strict";
/*
 * WhitelistUpdated event from TokenSale Contract
 *
 * * Author: Kedar
 * * Date: 26/10/2017
 * * Reviewed by: Sunil
 */

const web3WsProvider = require('../../lib/web3/ws_provider')
  , coreAddresses = require('../../config/core_addresses')
  , tokenSaleContractAbi = coreAddresses.getAbiForContract('tokenSale')
  , tokenSaleContractAddress = coreAddresses.getAddressForContract('tokenSale')
  , tokenSaleContract = new web3WsProvider.eth.Contract(tokenSaleContractAbi, tokenSaleContractAddress)
  , stApi = require('../../lib/request/st_api');

const eventCB = function(e, res){
  console.log('WhitelistUpdated received.');
  if (e) {
    console.error('### WhitelistUpdated error.');
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

// Listen to WhitelistUpdated event
tokenSaleContract.events.WhitelistUpdated({}, eventCB);