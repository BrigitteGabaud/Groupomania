"use strict";
/* Import des dépendances  et fonctions */
const express = require('express');
const router = express.Router(); //création router = usage "router." et non "app."
const auth = require('../middlewares/auth');
const commentCtrl = require('../controllers/comment-controllers');

/* Routes comment */
router.post('/', auth,  commentCtrl.createComment);
router.get('/:id', auth,  commentCtrl.getOneComment);
router.put('/:id', auth,  commentCtrl.modifyComment);
router.delete('/:id', auth,  commentCtrl.deleteComment);







module.exports = router;