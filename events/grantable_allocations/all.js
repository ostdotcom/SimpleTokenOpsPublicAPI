//"use strict";
///*
// * All events from grantable allocations
// *
// * * Author: Kedar
// * * Date: 26/10/2017
// * * Reviewed by: Sunil
// */
//
//const web3WsProvider = require('../../lib/web3/ws_provider')
//  , coreAddresses = require('../../config/core_addresses')
//  , contractAbi = coreAddresses.getAbiForContract('grantableAllocations')
//  , contractAddresses = coreAddresses.getAddressesForContract('grantableAllocations');
//
//for (var i = 0; i < contractAddresses.length; i++) {
//  var contract = new web3WsProvider.eth.Contract(contractAbi, contractAddresses[i]);
//
//  const eventCB = function(e, res){
//    if(res){
//      console.log('---------------------------');
//      console.log('success event in grantableAllocations');
//      console.log(res);
//      console.log('---------------------------');
//    }
//
//    if (e) {
//      console.log('---------------------------');
//      console.log('error event in grantableAllocations');
//      console.log(e);
//      console.log('---------------------------');
//    }
//  };
//
//  contract.events.allEvents({}, eventCB);
//}