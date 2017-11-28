"use strict";

/* grantable Allocations contract interactions
 *
 * * Author: Puneet
 * * Date: 28/11/2017
 * * Reviewed by: Kedar
 */

const web3RpcProvider = require('../web3/rpc_provider')
  , helper = require('./helper')
  , coreAddresses = require('../../config/core_addresses')
  , currContractAddresses = coreAddresses.getAddressesForContract('grantableAllocations')
  , currContract = new web3RpcProvider.eth.Contract(coreAddresses.getAbiForContract('grantableAllocations'))
  , getGranteesABI = currContract.methods.getGrantees().encodeABI()
  , fs = require('fs');

const grantableAllocationsContractInteract = {

  getGranteesData: async function () {

    var granteesData = []
      , promiseResolvers = [];

    for (var i = 0; i < currContractAddresses.length; i++) {
      promiseResolvers.push(helper.call(getGranteesABI, currContractAddresses[i]));
    }

    const processGetGranteeResponses = async function(getGranteesResponses){

      for(var i = 0; i < getGranteesResponses.length; i++) {
        var getGranteesRsp = getGranteesResponses[i];
        console.log(getGranteesRsp);
        var getGranteesRspArray = await helper.toAddressArray(getGranteesRsp);
        console.log(getGranteesRspArray);

        for (var j = 0; j < getGranteesRspArray.length; j++) {
          var granteeAddr = getGranteesRspArray[j];

          var granteeAllocationAbi = currContract.methods.grantableAllocations(granteeAddr).encodeABI();

          var allocationRsp = await helper.call(granteeAllocationAbi, currContractAddresses[i]);

          // decode allocationRsp

          granteesData.push([granteeAddr, allocationRsp.amount, allocationRsp.revokable])
        }
      }

      return Promise.resolve(granteesData);

    };

    const writeToCsv = function(granteesData){
      var stream = fs.createWriteStream("results.csv");
      stream.once('open', function(fd) {
        stream.write("address,amount,revokable\n");
        granteesData.forEach( function(granteeData) {
          console.log(granteeData);
          stream.write(granteeData[0]+","+granteeData[1]+granteeData[2]+"\n");
        });
        stream.end();
        process.exit();
      });
    };

    return Promise.all(promiseResolvers)
      .then(processGetGranteeResponses)
      .then(writeToCsv);

  }

};

module.exports = grantableAllocationsContractInteract;