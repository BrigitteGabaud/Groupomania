"use strict";

// Import Joi
const joi = require('joi');
const joiPassword = require("joi-password");

// Construction schema validation email + password
const schemaLogin = 

joi

.object({
    email: joi.string()
    .email({minDomainSegments:2, tlds:{allow:["com", "fr", "net"]}})
    .required()
    .pattern(new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)),

    password: joiPassword.joiPassword
    .string()
    .min(8)
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .required()
    .messages({
        "message" :"Le mot de passe doit comporter au moins 8 caractères, dont minimum 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial. Il ne doit pas comporter d'espace."
    }),
})


module.exports = schemaLogin;


