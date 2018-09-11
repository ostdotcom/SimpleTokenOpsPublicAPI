"use strict";
/*
 * All events from token sale
 *
 * * Author: Pankaj
 * * Date: 11/09/2018
 * * Reviewed by: Aniket
 */

const rootPrefix = '../..'
    , coreAddresses = require(rootPrefix + '/config/core_addresses')
    , updateWhitelistKlass = require(rootPrefix + '/events/whitelisting/whitelist_updated')
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