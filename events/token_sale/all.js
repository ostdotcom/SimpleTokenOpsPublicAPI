"use strict";
/*
 * All events from token sale
 *
 * * Author: Kedar
 * * Date: 26/10/2017
 * * Reviewed by: Sunil
 */

const web3WsProvider = require('../../lib/web3/ws_provider')
  , coreAddresses = require('../../config/core_addresses')
  , contractAbi = coreAddresses.getAbiForContract('tokenSale')
  , contractAddress = coreAddresses.getAddressForContract('tokenSale')
  , contract = new web3WsProvider.eth.Contract(contractAbi, contractAddress);

const eventCB = function(e, res){
  if(res){
    console.log('---------------------------');
    console.log('success event in tokenSale');
    console.log(res);
    console.log('---------------------------');
  }

  if (e) {
    console.log('---------------------------');
    console.log('error event in tokenSale');
    console.log(e);
    console.log('---------------------------');
  }
};

contract.events.allEvents({}, eventCB);