"use strict";
// Import Joi
const joi = require('joi');
const joiPassword = require("joi-password");

// Construction schema validation email + password
const schemaSignup = 

joi

.object({
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

    password: joiPassword.joiPassword
    .string()
    .min(8)
    .minOfSpecialCharacters(2)
    .minOfLowercase(2)
    .minOfUppercase(2)
    .minOfNumeric(2)
    .noWhiteSpaces()
    .required()
    .messages({
        "message" :"Votre mot de passe doit comporter au moins 8 caractères, dont minimum 2 majuscules, 2 minuscules, 2 chiffres et 2 caractères spéciaux. Il ne doit pas comporter d'espace."
    })
})


module.exports = schemaSignup;
