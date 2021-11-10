"use strict";
/* Import des dépendances */
require('dotenv').config()
const express = require('express');
const helmet = require('helmet');

/* Import routers */
const userRoutes = require('./routes/user-routes');


/* Crée application express */
const app = express();

/* Configuration headers appliquée à toutes les routes (CORS)  */
/* Permet au front-end d'accéder à l'API */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // =  ok accès à tout le monde
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // = ok utilisation headers sur obj req
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');// = ok utilisation verbes requête
    next();
});

/* Fonction ajoutant sécurité dans les headers */
app.use(helmet());

/* Fonction transformant le corps de la requête en objet javascript */
app.use(express.urlencoded({ extended: true }))
app.use(express.json());


/* Enregistrement routers */
app.use('/api/user', userRoutes);

/*Exporte application et la rend dispo dans les autres fichiers */
module.exports = app;