"use strict";

/*
 * Constants file
 *
 * * Author: Rachin
 * * Date: 23/10/2017
 * * Reviewed by: Sunil
 */
function define(name, value) {
  Object.defineProperty(exports, name, {
    value: value,
    enumerable: true
  });
}

define("HTTPS_PORT", process.env.OPS_API_HTTPS_PORT);
define("HTTPS_KEY", process.env.OPS_API_HTTPS_KEY);
define("HTTPS_CERT", process.env.OPS_API_HTTPS_CERT);

define("ST_GETH_RPC_PROVIDER", process.env.ST_GETH_RPC_PROVIDER);
define("ST_GETH_WS_PROVIDER", process.env.ST_GETH_WS_PROVIDER);
define("ST_OPS_PUBLIC_API_SECRET_KEY", process.env.ST_OPS_PUBLIC_API_SECRET_KEY);
define("ST_API_BASE_URL", process.env.ST_API_BASE_URL);

define("ST_MAILER_TRASNPORT_PATH",process.env.ST_MAILER_TRASNPORT_PATH);
define("ST_FROM_EMAILER",process.env.ST_FROM_EMAILER);

define("ENV", process.env.NODE_ENV);