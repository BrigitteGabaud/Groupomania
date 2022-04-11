"use strict";
const rateLimit = require('express-rate-limit');

/* Fonction limitation requêtes création compte */
exports.Limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 1 heure de pénalisation
    max: 100, // Bloque à partir de 5 requêtes
    message:
      "Trop de tentatives de connexion ou de création de comptes à partir de cette adresse IP, veuillez réessayer d'ici une heure."
});