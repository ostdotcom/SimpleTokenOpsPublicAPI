"use strict";
/*
 * All events from trustee
 *
 * * Author: Kedar
 * * Date: 26/10/2017
 * * Reviewed by: Sunil
 */

const coreAddresses = require('../../config/core_addresses')
  , contractAbi = coreAddresses.getAbiForContract('trustee')
  , contractAddress = coreAddresses.getAddressForContract('trustee');

const eventCB = function(e, res){
  if(res){
    console.log('---------------------------');
    console.log('success event in trustee');
    console.log(res);
    console.log('---------------------------');
  }

  if (e) {
    console.log('---------------------------');
    console.log('error event in trustee');
    console.log(e);
    console.log('---------------------------');
  }
};


const trusteeEvents = {

  subscribe: async function(web3WsProvider){
    console.log(" Contract trustee address: " + contractAddress + " to Subscribe events");
    let contract = await new web3WsProvider.eth.Contract(contractAbi, contractAddress);
    contract.events.allEvents({}, eventCB);
  },

  onUnsubscribed: function(){}

};

module.exports = trusteeEvents;