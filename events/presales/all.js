"use strict";
/*
* All events from presales
*
* * Author: Kedar
* * Date: 26/10/2017
* * Reviewed by: Sunil
*/


const coreAddresses = require('../../config/core_addresses')
    , contractAbi = coreAddresses.getAbiForContract('presales')
    , contractAddress = coreAddresses.getAddressForContract('presales');

const eventCB = function(e, res){
    if(res){
        console.log('---------------------------');
        console.log('success event in presales');
        console.log(res);
        console.log('---------------------------');
    }

    if (e) {
        console.log('---------------------------');
        console.log('error event in presales');
        console.log(e);
        console.log('---------------------------');
    }
};

const presalesEvents = {

    subscribe: async function(web3WsProvider){
        console.log(" Contract presales address: " + contractAddress + " to Subscribe events");
        let contract = await new web3WsProvider.eth.Contract(contractAbi, contractAddress);
        contract.events.allEvents({}, eventCB);
    },

    onUnsubscribed: function(){}

};

module.exports = presalesEvents;