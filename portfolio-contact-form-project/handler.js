"use strict";
const AWS = require("aws-sdk");
const SES = new AWS.SES();

function sendEmail(formData, callback) {
  const emailParams = {
    Source: "knop.gm@gmail.com", // SES SENDING EMAIL
    ReplyToAddresses: [formData.reply_to],
    Destination: {
      ToAddresses: ["knop.gm@gmail.com"], // SES RECEIVING EMAIL
    },
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: `${formData.message}\n\nName: ${formData.name}\nEmail: ${formData.reply_to}`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Portfolio New message (https://gabriela-portfolio-cf.netlify.app)",
      },
    },
  };

  SES.sendEmail(emailParams, callback);
}

module.exports.staticSiteMailer = (event, context, callback) => {
  const formData = JSON.parse(event.body);

  sendEmail(formData, function (err, data) {
    const response = {
      statusCode: err ? 500 : 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin":
          "https://gabriela-portfolio-cf.netlify.app",
      },
      body: JSON.stringify({
        message: err ? err.message : data,
      }),
    };

    callback(null, response);
  });
};
