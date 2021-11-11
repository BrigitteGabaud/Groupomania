"use strict";
/* Import des dépendances  et fonctions */
const express = require('express');
const router = express.Router(); //création router = usage "router." et non "app."
//const auth = require('../middlewares/auth');
const userCtrl = require('../controllers/user-controllers')

/* Route post: création compte */
router.post('/signup', userCtrl.signup);

/* Route post: authentification */
router.post('/login', userCtrl.login);

module.exports = router;