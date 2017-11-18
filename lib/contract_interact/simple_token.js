"use strict";
/*
 * Simple Token contract interactions
 *
 * * Author: Kedar, Alpesh
 * * Date: 15/11/2017
 * * Reviewed by: Sunil
 */

const web3RpcProvider = require('../web3/rpc_provider')
  , helper = require('./helper')
  , coreAddresses = require('../../config/core_addresses')
  , currContractAddr = coreAddresses.getAddressForContract('simpleToken')
  , currContract = new web3RpcProvider.eth.Contract(coreAddresses.getAbiForContract('simpleToken'));

const simpleTokenContractInteract = {

  getBalance: function (addr) {
    const encodeABI = currContract.methods.balanceOf(addr).encodeABI();

    return helper.call(encodeABI, currContractAddr).then(helper.decodeUint256);
  }

};

module.exports = simpleTokenContractInteract;