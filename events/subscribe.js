"use strict";
/*
 * Subscribe to all the relevant events
 *
 * * Author: Kedar
 * * Date: 26/10/2017
 * * Reviewed by: Sunil
 */

// subscribe to WhitelistUpdated Event
const rootPrefix = '..'
  , coreAddresses = require(rootPrefix + '/config/core_addresses')
  , updateWhitelistKlass = require(rootPrefix + '/events/token_sale/whitelist_updated')
  ;

async function updateWhitelist(){

  let timeoutTime = 21600;
  const whitelistContractAddresses = await coreAddresses.getGenericWhitelistContractAddresses();

  if (whitelistContractAddresses === undefined){
    timeoutTime = 3000;
  }else{
    console.log("whitelistContractAddresses : ",whitelistContractAddresses);
    updateWhitelistKlass.updateWhitelist(whitelistContractAddresses);
  }
  setTimeout(updateWhitelist,timeoutTime);
}
updateWhitelist();

require('./token_sale/all');

require('./simple_token/all');

require('./trustee/all');

require('./presales/all');

require('./future_token_sale_lock_box/all');

require('./grantable_allocations/all');