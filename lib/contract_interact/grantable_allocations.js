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

const _private = {

    processGetGranteeResponses: async function (getGranteesResponses) {

        var granteesData = []

        for (var i = 0; i < getGranteesResponses.length; i++) {

            var getGranteesRsp = getGranteesResponses[i];

            var getGranteesRspArray = await helper.toAddressArray(getGranteesRsp);

            for (var j = 0; j < getGranteesRspArray.length; j++) {

                var granteeAddr = getGranteesRspArray[j];

                var granteeAllocationAbi = currContract.methods.grantableAllocations(granteeAddr).encodeABI();

                var allocationRsp = await helper.call(granteeAllocationAbi, currContractAddresses[i]);

                var decodedAllocationRsp = await helper.toGrantableAllocation(allocationRsp)

                granteesData.push([granteeAddr, decodedAllocationRsp.amount, decodedAllocationRsp.revokable])

            }

        }

        return Promise.resolve(granteesData);

    },

    writeToCsv: async function (granteesData) {
        var stream = fs.createWriteStream("results.csv");
        stream.once('open', function (fd) {
            granteesData.forEach(function (granteeData) {
                stream.write(granteeData[0] + "," + granteeData[1] + "," + granteeData[2] + "\n");
            });
            stream.end();
        });
    }

};

const grantableAllocationsContractInteract = {

    getGranteesData: async function () {

        var promiseResolvers = [];

        for (var i = 0; i < currContractAddresses.length; i++) {
            console.log('initiating fetching data from contract at' + currContractAddresses[i]);
            promiseResolvers.push(helper.call(getGranteesABI, currContractAddresses[i]));
        }

        var getGranteesResponses = await Promise.all(promiseResolvers);

        var granteesData = await _private.processGetGranteeResponses(getGranteesResponses);

        console.log('Writing to Csv total count:' + granteesData.length);

        await _private.writeToCsv(granteesData);

        return Promise.resolve({});

    }

};

module.exports = grantableAllocationsContractInteract;