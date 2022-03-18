"use strict";

// Import Joi
const joi = require('joi');

// Construction schema validation email + password
const schemaUserModify = 

joi

.object({
    firstname: joi.string()
    .alphanum()
    .min(3)
    .max(30),

    lastname: joi.string()
    .alphanum()
    .min(3)
    .max(30),

    email: joi.string()
    .email({minDomainSegments:2, tlds:{allow:["com", "fr", "net"]}})
    .pattern(new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)),

    bio: joi.string()
    .max(255)
    .regex(/^.{1,50}$/)
})


module.exports = schemaUserModify;

