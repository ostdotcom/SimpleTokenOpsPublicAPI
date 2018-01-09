"use strict";
/*
 * Bonuses
 *
 * * Author: Puneet
 * * Date: 11/11/2017
 * * Reviewed by:
 *
 * node bonusesData.js 1
 *
 */

// STEPS
//
// READ Contract (using index. index starts from 1)

const rootPrefix = '../..'
    , bonusesContractInteractKlass = require(rootPrefix + '/lib/contract_interact/bonuses')
    , coreAddresses = require(rootPrefix + '/config/core_addresses')
    , contractName = 'bonuses'
    , contractAddresses = coreAddresses.getAddressesForContract(contractName);

const bonusAllocationsDataVerifier = {

  perform: async function() {

    const contractIndex = parseInt(process.argv[2]);

    console.log('contractIndex: ' + contractIndex);
    if (contractIndex < 1 || contractIndex > contractAddresses.length) {
      console.error('index should be >= 1 and less than contract length');
      process.exit(1);
    }

    const contractAddress = contractAddresses[contractIndex-1]
        , bonusesContractInteract = new bonusesContractInteractKlass(contractAddress);

    console.log('Starting verification for bonus allocations from address: ' + contractAddress);

    const fileName = 'bonuses_' + contractIndex + "_in_stwei.csv";
    var csvLength = await bonusesContractInteract.writeBonusesDataToCsv(fileName);
    console.log('CSV Written to Disk @' + fileName);

    const addressesSize = await bonusesContractInteract.getProcessablesSize();

    if (addressesSize != csvLength) {
      console.error('mismatch in size');
      console.error('from CSV: ' + csvLength);
      console.error('from contract ' + addressesSize);
    }

    const status = await bonusesContractInteract.getStatus();

    if (status != 1) {
      console.error('status is != 1. it is : ' + status); // it should be 1 ie locked
      // if it is 2, it means that Berlin team has approved Contract which is also OK
    }

    console.log('Ended verification for bonus allocations');

  }

}

bonusAllocationsDataVerifier.perform();