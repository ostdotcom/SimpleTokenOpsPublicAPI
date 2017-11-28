"use strict";

const grantableAllocationsContractInteract = require('../../lib/contract_interact/grantable_allocations');

const grantableAllocationsDataVerifier = {

  perform: function() {
    grantableAllocationsContractInteract.getGranteesData().then(console.log('Done!!'));
  }

}

grantableAllocationsDataVerifier.perform();