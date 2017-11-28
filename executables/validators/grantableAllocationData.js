"use strict";

const grantableAllocationsContractInteract = require('../../lib/contract_interact/grantable_allocations');

const grantableAllocationsDataVerifier = {

  perform: async function() {

    console.log('Starting verification for grantable allocations');
    await grantableAllocationsContractInteract.getGranteesData();
    console.log('Ended verification for grantable allocations');

  }

}

grantableAllocationsDataVerifier.perform();