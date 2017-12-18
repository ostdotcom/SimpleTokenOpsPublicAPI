"use strict";
/*
 * Simple Token contract interactions
 *
 * * Author: Alpesh, Kushal, Pankaj, Aniket
 * * Date: 17/11/2017
 * * Reviewed by: Sunil
 */

const web3RpcProvider = require('../web3/rpc_provider')
  , helper = require('./helper')
  , core_abis = require('../../config/core_abis')
  , genericERC20ContractAbi = core_abis.genericERC20Contract
  , currGenericERC20ContractContract = new web3RpcProvider.eth.Contract(genericERC20ContractAbi);

const thirdPartyContractInteract = {

  getBalance: function (addr, thirdPartyERC20ContractAddr) {

    const encodeABI = currGenericERC20ContractContract.methods.balanceOf(addr).encodeABI();

    return helper.call(encodeABI, thirdPartyERC20ContractAddr).then(helper.decodeUint256);
  },

  getNumberOfDecimals: function (thirdPartyERC20ContractAddr) {

    const encodeABI = currGenericERC20ContractContract.methods.decimals().encodeABI();

    return helper.call(encodeABI, thirdPartyERC20ContractAddr).then(helper.decodeUint256);
  }

};

module.exports = thirdPartyContractInteract;