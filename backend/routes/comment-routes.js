"use strict";

/* Import des dépendances  et fonctions */
const express = require('express');
const router = express.Router(); //création router = usage "router." et non "app."
const auth = require('../middlewares/auth');
const commentCtrl = require('../controllers/comment-controllers');

/* Routes comment */
router.post('/:postId', auth, commentCtrl.createComment);
router.get('/:postId/', auth, commentCtrl.getAllCommentsOfAPost)
router.get('/:id', auth,  commentCtrl.getOneComment);
router.put('/:commentId', auth,  commentCtrl.modifyComment);
router.delete('/:commentId', auth,  commentCtrl.deleteComment);

module.exports = router;