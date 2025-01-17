"use strict";
/*
 * Main application file
 *
 * * Author: Rachin
 * * Date: 23/10/2017
 * * Reviewed by: Sunil
 */
const express = require('express')
  , path = require('path')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , helmet = require('helmet')
  , sanitizer = require('express-sanitized')
  , app = express()
  , responseHelper = require('./lib/formatter/response')
  , jwtAuth = require('./lib/jwt/jwt_auth')
  , addressRoutes = require('./routes/address')
  , transactionRoutes = require('./routes/transaction')
  , blockRoutes = require('./routes/block')
  , tokenSaleRoutes = require('./routes/token_sale')
  , bonusesRoutes = require('./routes/bonuses')
  , thirdPartyContractRoutes = require('./routes/third_party_contract')
  , rootRoutes = require('./routes/root')
  , subscribeRoutes = require('./routes/subscribe')
  , subscribeHelper = require('./events/subscribe')
;

subscribeHelper.processSubscription();

// uncomment after placing your favicon in /public
app.use(logger('combined'));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*
  The below peice of code should always be before routes.
  Docs: https://www.npmjs.com/package/express-sanitized
*/
app.use(sanitizer());

// before action for verifying the jwt token and setting the decoded info in req obj
const decodeJwt = function(req, res, next) {

  var token = null;
  if (req.method == 'POST') {
    token = req.body.token;
  } else if (req.method == 'GET') {
    token = req.query.token;
  } else {
    return next();
  }

  // Set the decoded params in the re and call the next in control flow.
  const jwtOnResolve = function (reqParams) {
    req.decodedParams = reqParams.data;
    // Validation passed.
    return next();
  };

  // send error, if token is invalid
  const jwtOnReject = function (err) {
    console.error(err);
    return responseHelper.error('a_1', 'Invalid token or expired').renderResponse(res);
  };

  // Verify token
  Promise.resolve(
    jwtAuth.verifyToken(token, 'publicOps')
      .then(
        jwtOnResolve,
        jwtOnReject
      )
  ).catch(function (err) {
    console.error(err);
    responseHelper.error('a_2', 'Something went wrong').renderResponse(res)
  });

};

app.use('/transaction', decodeJwt, transactionRoutes);
app.use('/block', decodeJwt, blockRoutes);
app.use('/address', decodeJwt, addressRoutes);
app.use('/token-sale', decodeJwt, tokenSaleRoutes);
app.use('/third-party-contract', decodeJwt, thirdPartyContractRoutes);
app.use('/bonuses', decodeJwt, bonusesRoutes);
app.use('/subscribe',decodeJwt,subscribeRoutes);
app.use('/', rootRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  return responseHelper.error('404', 'Not Found').renderResponse(res, 404);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.error(err);
  return responseHelper.error('500', 'Something went wrong').renderResponse(res, 500);
});

module.exports = app;
