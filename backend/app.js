"use strict";
/* Import des dépendances */
require('dotenv').config()
const express = require('express');
const userRoutes = require('./routes/user-routes');

/* Crée application express */
const app = express();

// Routes
app.use('/api/user', userRoutes);

/*Exporte application et la rend dispo dans les autres fichiers */
module.exports = app;