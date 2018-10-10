"use strict";
/*
 * Subscribe to all the relevant events
 *
 * * Author: Kedar
 * * Date: 26/10/2017
 * * Reviewed by: Sunil
 */

const eventSubscription = {

  reSubscribe: function(){
    whitelistingEvents.updateWhitelist();
  }
};

module.exports = eventSubscription;

require('./token_sale/all');

require('./simple_token/all');

require('./trustee/all');

require('./presales/all');

require('./future_token_sale_lock_box/all');

require('./grantable_allocations/all');

const whitelistingEvents = require('./whitelisting/all');

whitelistingEvents.updateWhitelist();