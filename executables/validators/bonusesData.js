"use strict";

const bonusesContractInteract = require('../../lib/contract_interact/bonuses');

const bonusAllocationsDataVerifier = {

  perform: async function() {

    console.log('Starting verification for bonus allocations');

    const fileName = 'bonusesData.csv';
    var csvLength = await bonusesContractInteract.writeBonusesDataToCsv();
    console.log('CSV Written to Disk @' + fileName);

    const addressesSize = await bonusesContractInteract.getAddressesSize();

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