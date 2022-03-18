"use strict";

/* Import des dépendances  et fonctions */
const express = require('express');
const router = express.Router(); //création router = usage "router." et non "app."
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');
const userCtrl = require('../controllers/user-controllers');
const rateLimit = require('../middlewares/rate-limit');

/* Routes user */
router.post('/signup', rateLimit.Limiter, userCtrl.signup);
router.post('/login', rateLimit.Limiter, userCtrl.login);
router.get('/:id', auth, userCtrl.getOneUser)
router.get('/',auth,  userCtrl.getAllUsers)
router.put('/:id',auth, multer, userCtrl.modifyUser );
router.delete('/:id',auth, multer, userCtrl.deleteUser );

module.exports = router;