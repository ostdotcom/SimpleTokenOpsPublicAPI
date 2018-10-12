"use strict";
/*
 * All events from simple token
 *
 * * Author: Kedar
 * * Date: 26/10/2017
 * * Reviewed by: Sunil
 */

const coreAddresses = require('../../config/core_addresses')
  , contractAbi = coreAddresses.getAbiForContract('simpleToken')
  , contractAddress = coreAddresses.getAddressForContract('simpleToken');

const eventCB = function(e, res){
  if(res){
    console.log('---------------------------');
    console.log('success event in simpleToken');
    console.log(res);
    console.log('---------------------------');
  }

  if (e) {
    console.log('---------------------------');
    console.log('error event in simpleToken');
    console.log(e);
    console.log('---------------------------');
  }
};

const simpleTokenEvents = {

  subscribe: async function(web3WsProvider){
      console.log(" Contract simpleToken address: " + contractAddress + " to Subscribe events");
      let contract = await new web3WsProvider.eth.Contract(contractAbi, contractAddress);
      contract.events.allEvents({}, eventCB);
  },

  onUnsubscribed: function(){}

};

module.exports = simpleTokenEvents;