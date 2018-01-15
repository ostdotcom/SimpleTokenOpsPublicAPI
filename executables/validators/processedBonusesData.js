"use strict";
/*
 * Bonuses
 *
 * * Author: Puneet
 * * Date: 11/11/2017
 * * Reviewed by:
 *
 * node executables/validators/processedBonusesData.js 2
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

const processedBonusAllocationsDataVerifier = {

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

    const status = await bonusesContractInteract.getStatus();

    if (status != 3) {
      console.error('status is != 3. it is : ' + status); // it should be 3 ie completed
    }

    const unProcessedAddresses = await bonusesContractInteract.findUnProcessedAddresses();

    if (unProcessedAddresses.length > 0) {
      console.error('unProcessedAddresses found in contract');
      console.error(unProcessedAddresses);
    }

    console.log('Ended verification for bonus allocations');

  }

}

processedBonusAllocationsDataVerifier.perform();