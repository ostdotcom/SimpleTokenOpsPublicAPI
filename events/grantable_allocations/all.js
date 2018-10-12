"use strict";
/*
* All events from grantable allocations
*
* * Author: Kedar
* * Date: 26/10/2017
* * Reviewed by: Sunil
*/


const coreAddresses = require('../../config/core_addresses')
    , contractAbi = coreAddresses.getAbiForContract('grantableAllocations')
    , contractAddress = coreAddresses.getAddressForContract('grantableAllocations');

const eventCB = function(e, res){
    if(res){
        console.log('---------------------------');
        console.log('success event in grantableAllocations');
        console.log(res);
        console.log('---------------------------');
    }

    if (e) {
        console.log('---------------------------');
        console.log('error event in grantableAllocations');
        console.log(e);
        console.log('---------------------------');
    }
};

const grantableAllocationsEvents = {

    subscribe: async function(web3WsProvider){
        console.log(" Contract grantableAllocations address: " + contractAddress + " to Subscribe events");
        let contract = await new web3WsProvider.eth.Contract(contractAbi, contractAddress);
        contract.events.allEvents({}, eventCB);
    },

    onUnsubscribed: function(){}

};

module.exports = grantableAllocationsEvents;