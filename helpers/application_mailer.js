"use strict";

/**
 *
 * Send email from application.<br><br>
 *
 * @module lib/application_mailer
 *
 */

// Load external modules
const applicationMailer = require('nodemailer')
;

//All Module Requires.
const rootPrefix = '..'
  , coreConstants = require(rootPrefix + '/config/core_constants')
  , responseHelper = require(rootPrefix + '/lib/formatter/response')
;

const environment = coreConstants.ENV
;

/**
 * constructor
 *
 * @constructor
 */
const applicationMailerKlass = function () {
  const oThis = this;
};

applicationMailerKlass.prototype = {

  /**
   * Send Email Using Sendmail
   *
   * @param {string} to - send email to
   * @param {string} from - send email from
   * @param {string} subject - email subject
   * @param {string} body - email text body
   *
   * @return {Promise<Result>} - On success, data.value has value. On failure, error details returned.
   */
  perform: function (params) {

    const oThis = this;

    oThis.transporter = applicationMailer.createTransport({
      sendmail: true,
      newline: 'unix',
      path: coreConstants.ST_MAILER_TRASNPORT_PATH
    });

    var fromEmail = coreConstants.ST_FROM_EMAILER
      , toEmail = 'aniket@ost.com, aman@ost.com, pankaj@ost.com, tejas@ost.com'
      , subjectPrefix = "STOPuA::" + environment + " ";
    ;

    if (environment != 'development') {
      oThis.transporter.sendMail(
        {
          from: params.from || fromEmail,
          to: params.to || toEmail,
          subject: subjectPrefix + params.subject,
          text: params.body
        }, function (err, info) {
          console.log("envelope:", info.envelope, "messageId:", info.messageId, "Error:", JSON.stringify(err))
        }
      );
    }

    return Promise.resolve(responseHelper.successWithData({}));
  }
};

module.exports = new applicationMailerKlass();
