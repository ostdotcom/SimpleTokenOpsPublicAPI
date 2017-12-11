"use strict";

const processableAllocationsContractInteract = require('../../lib/contract_interact/processable_allocations');

const processableAllocationsDataVerifier = {

  perform: async function() {

    console.log('Starting verification for processable allocations');
    await processableAllocationsContractInteract.getProcessableData();
    console.log('Ended verification for processable allocations');
  }

}

processableAllocationsDataVerifier.perform();