"use strict";
/*
 * All events from future token sale lock box
 *
 * * Author: Kedar
 * * Date: 26/10/2017
 * * Reviewed by: Sunil
 */

const web3WsProvider = require('../../lib/web3/ws_provider')
  , coreAddresses = require('../../config/core_addresses')
  , contractAbi = coreAddresses.getAbiForContract('futureTokenSaleLockBox')
  , contractAddress = coreAddresses.getAddressForContract('futureTokenSaleLockBox')
  , contract = new web3WsProvider.eth.Contract(contractAbi, contractAddress);

const eventCB = function(e, res){
  if(res){
    console.log('---------------------------');
    console.log('success event in futureTokenSaleLockBox');
    console.log(res);
    console.log('---------------------------');
  }

  if (e) {
    console.log('---------------------------');
    console.log('error event in futureTokenSaleLockBox');
    console.log(e);
    console.log('---------------------------');
  }
};

contract.events.allEvents({}, eventCB);