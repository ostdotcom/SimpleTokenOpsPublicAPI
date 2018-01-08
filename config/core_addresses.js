"use strict";
/*
 * Addresses
 *
 * * Author: Kedar
 * * Date: 23/10/2017
 * * Reviewed by: Sunil
 */

const core_abis = require('./core_abis');

const allAddresses = {
  contracts: {
    simpleToken: {
      address: process.env.ST_SIMPLE_TOKEN_CONTRACT_ADDR,
      abi: core_abis.simpleToken
    },
    tokenSale: {
      address: process.env.ST_TOKEN_SALE_CONTRACT_ADDR,
      abi: core_abis.tokenSale
    },
    genericWhitelist: {
      address: JSON.parse(process.env.ST_GENERIC_WHITELIST_CONTRACT_ADDRS),
      abi: core_abis.genericWhitelist
    },
    trustee: {
      address: process.env.ST_TRUSTEE_CONTRACT_ADDR,
      abi: core_abis.trustee
    },
    futureTokenSaleLockBox: {
      address: process.env.ST_FUTURE_TOKEN_SALE_LOCK_BOX_CONTRACT_ADDR,
      abi: core_abis.futureTokenSaleLockBox
    },
    grantableAllocations: {
      address: JSON.parse(process.env.ST_GRANTABLE_ALLOCATIONS_CONTRACT_ADDRS),
      abi: core_abis.grantableAllocations
    },
    presales: {
      address: JSON.parse(process.env.ST_PRESALES_CONTRACT_ADDRS),
      abi: core_abis.presales
    },
    processableAllocations: {
      address: JSON.parse(process.env.ST_PROCESSABLE_ALLOCATIONS_CONTRACT_ADDRS),
      abi: core_abis.processableAllocations
    },
    multiSigWallet: {
      address: JSON.parse(process.env.ST_MULTI_SIG_WALLET_ADDRS),
      abi: core_abis.multiSigWallet
    },
    genericERC20Contract: {
      address: JSON.parse(process.env.ST_GENERIC_ERC20_CONTRACT_ADDRS),
      abi: core_abis.genericERC20Contract
    }
  }
};

const addrToContractNameMap = {};

for(var contractName in allAddresses.contracts) {
  var addr = allAddresses.contracts[contractName].address;

  if ( Array.isArray(addr) ) {
    for(var i = 0; i < addr.length; i ++) {
      addrToContractNameMap[addr[i].toLowerCase()] = contractName;
    }
  } else {
    addrToContractNameMap[addr.toLowerCase()] = contractName;
  }
}

const coreAddresses = {
  getAddressForUser: function(userName){
    return allAddresses.users[userName].address;
  },

  getPassphraseForUser: function(userName){
    return allAddresses.users[userName].passphrase;
  },

  getAddressForContract: function(contractName){
    var contractAddress = allAddresses.contracts[contractName].address;
    if(!contractAddress || contractAddress=='' || Array.isArray(contractAddress)){
      throw "Please pass valid contractName to get contract address"
    }
    return contractAddress;
  },

  // This must return array of addresses.
  getAddressesForContract: function(contractName){
    var contractAddresses = allAddresses.contracts[contractName].address;
    if(!contractAddresses || !Array.isArray(contractAddresses)){
      throw "Please pass valid contractName to get contract address"
    }
    return contractAddresses;
  },

  getContractNameFor: function(contractAddr) {
    return addrToContractNameMap[(contractAddr || '').toLowerCase()];
  },

  getAbiForContract: function(contractName) {
    return allAddresses.contracts[contractName].abi;
  }
};

module.exports = coreAddresses;

