"use strict";
/*
 * Trustee contract interactions
 *
 * * Author: Puneet
 * * Date: 05/02/2019
 * * Reviewed by:
 */

const rootPrefix = '../..'
  , web3RpcProvider = require(rootPrefix + '/lib/web3/rpc_provider')
  , helper = require(rootPrefix + '/lib/contract_interact/helper')
  , coreAddresses = require(rootPrefix + '/config/core_addresses')
  , contractName = 'trustee'
  , currContractAddr = coreAddresses.getAddressForContract(contractName)
  , currContract = new web3RpcProvider.eth.Contract(coreAddresses.getAbiForContract(contractName));

const simpleTokenContractInteract = {

  getAllocationsData: function (addr) {

    const encodeABI = currContract.methods.allocations(addr).encodeABI();

    return helper.call(encodeABI, currContractAddr).then(helper.toTrusteeAllocation);

  }

};

module.exports = simpleTokenContractInteract;