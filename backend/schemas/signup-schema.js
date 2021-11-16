"use strict";
// Import Joi
const joi = require('joi');

// Construction schema validation email + pasword
const schemaSignup = joi.object({
    firstname: joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),

    lastname: joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),

    email: joi.string()
    .email({minDomainSegments:2, tlds:{allow:["com", "fr", "net"]}})
    .required()
    .pattern(new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)),

    password: joi.string()
    .min(8)
    .required(),

});

module.exports = schemaSignup;
