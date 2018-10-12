"use strict";
/*
 * All events from token sale
 *
 * * Author: Kedar
 * * Date: 26/10/2017
 * * Reviewed by: Sunil
 */

const coreAddresses = require('../../config/core_addresses')
  , contractAbi = coreAddresses.getAbiForContract('tokenSale')
  , contractAddress = coreAddresses.getAddressForContract('tokenSale');

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


const tokenSaleEvents = {

  subscribe: async function(web3WsProvider){
      console.log(" Contract tokenSale address: " + contractAddress + " to Subscribe events");
      let contract = await new web3WsProvider.eth.Contract(contractAbi, contractAddress);
      contract.events.allEvents({}, eventCB);
  },

  onUnsubscribed: function(){}

};

module.exports = tokenSaleEvents;