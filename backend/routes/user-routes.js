"use strict";
/* Import des dépendances  et fonctions */
const express = require('express');
const router = express.Router(); //création router = usage "router." et non "app."
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');
const userCtrl = require('../controllers/user-controllers');

/* Route post: création compte */
router.post('/signup', userCtrl.signup);
/* Route post: authentification */
router.post('/login', userCtrl.login);
/* Route get: récupération un user */
router.get('/:id', auth, userCtrl.getOneUser)
/* Route get: récupération tous les users */
router.get('/',auth,  userCtrl.getAllUsers)
/* Route put: modification user */
router.put('/:id',auth, multer, userCtrl.modifyUser );
/* Route delete: suppression user */
router.delete('/:id',auth, multer, userCtrl.deleteUser );





module.exports = router;