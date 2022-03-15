"use strict";

/* Import des dépendances  et fonctions */
const express = require('express');
const router = express.Router(); //création router = usage "router." et non "app."
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');
const postCtrl = require('../controllers/post-controllers');

/* Routes post */
router.get('/user/:userId', auth, postCtrl.getAllPostsOfOneUser)
router.get('/', auth, postCtrl.getAllPosts);
router.post('/', auth, multer,  postCtrl.createPost);
router.get('/:id', auth, postCtrl.getOnePost);
router.put('/:id', auth, multer, postCtrl.modifyPost);
router.delete('/:id', auth, postCtrl.deletePost)

module.exports = router;