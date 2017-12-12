"use strict";

/* processable Allocations contract interactions
 *
 * * Author: Aman
 * * Date: 11/12/2017
 * * Reviewed by:
 */

const web3RpcProvider = require('../web3/rpc_provider')
    , helper = require('./helper')
    , coreAddresses = require('../../config/core_addresses')
    , currContractAddresses = coreAddresses.getAddressesForContract('processableAllocations')
    , currContract = new web3RpcProvider.eth.Contract(coreAddresses.getAbiForContract('processableAllocations'))
    , getGranteesABI = currContract.methods.getGrantees().encodeABI()
    , fs = require('fs');

const _private = {

    processGetGranteeResponses: async function (getGranteesResponses) {

        var processablesData = []

        for (var i = 0; i < getGranteesResponses.length; i++) {

            var getGranteesRsp = getGranteesResponses[i];

            var getGranteesRspArray = await helper.toAddressArray(getGranteesRsp);

            for (var j = 0; j < getGranteesRspArray.length; j++) {

                var granteeAddr = getGranteesRspArray[j];

                var processableAllocationAbi = currContract.methods.processableAllocations(granteeAddr).encodeABI();

                var allocationRsp = await helper.call(processableAllocationAbi, currContractAddresses[i]);

                var decodedAllocationRsp = await helper.toProcessableAllocation(allocationRsp)

                processablesData.push([granteeAddr, decodedAllocationRsp.amount])

            }

        }

        return Promise.resolve(processablesData);

    },

    writeToCsv: async function (granteesData) {
        var stream = fs.createWriteStream("results.csv");
        stream.once('open', function (fd) {
            granteesData.forEach(function (granteeData) {
                stream.write(granteeData[0] + "," + granteeData[1] + "\n");
            });
            stream.end();
        });
    }

};

const processableAllocationsContractInteract = {

    getProcessableData: async function () {

        var promiseResolvers = [];

        for (var i = 0; i < currContractAddresses.length; i++) {
            console.log('initiating fetching data from contract at' + currContractAddresses[i]);
            promiseResolvers.push(helper.call(getGranteesABI, currContractAddresses[i]));
        }

        var getGranteesResponses = await Promise.all(promiseResolvers);

        var granteesData = await _private.processGetGranteeResponses(getGranteesResponses);

        console.log('Writing to Csv total count:' + granteesData.length);

        await _private.writeToCsv(granteesData);

        Promise.resolve({});

    }

};

module.exports = processableAllocationsContractInteract;