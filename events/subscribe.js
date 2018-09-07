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

let retryCount = 1;

async function updateWhitelist() {

    let timeoutTime = 21600000; // 6 hours
    const whitelistContractAddresses = await coreAddresses.getGenericWhitelistContractAddresses();

    if (whitelistContractAddresses === undefined) {
        if (retryCount < 10) {
            timeoutTime = 10000 * retryCount; // 10 seconds
            retryCount++;
        }else{
            retryCount = 1;
        }
    } else {
        retryCount = 1;
        updateWhitelistKlass.updateWhitelist(whitelistContractAddresses);
    }
    setTimeout(updateWhitelist, timeoutTime);
}

updateWhitelist();

require('./token_sale/all');

require('./simple_token/all');

require('./trustee/all');

require('./presales/all');

require('./future_token_sale_lock_box/all');

require('./grantable_allocations/all');