"use strict";
/*
 * All events from future token sale lock box
 *
 * * Author: Kedar
 * * Date: 26/10/2017
 * * Reviewed by: Sunil
 */

const coreAddresses = require('../../config/core_addresses')
  , contractAbi = coreAddresses.getAbiForContract('futureTokenSaleLockBox')
  , contractAddress = coreAddresses.getAddressForContract('futureTokenSaleLockBox');

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

const futureTokenSaleLockEvents = {

  subscribe: async function(web3WsProvider){
    console.log(" Contract futureTokenSaleLockBox address: " + contractAddress + " to Subscribe events");
    let contract = await new web3WsProvider.eth.Contract(contractAbi, contractAddress);
    contract.events.allEvents({}, eventCB);
  },

  onUnsubscribed: function(){}

};

module.exports = futureTokenSaleLockEvents;