"use strict";
/* Import dépendances */

const fs = require('fs'); // Donne accès aux opérations liées aux syst de fichiers (modif /suppr) 


/* Import dossier models */
const db = require('../models');


/*** Creation post  ***/
exports.createPost = (req, res) => {
  const postContent = req.body
  console.log("postContent" ,postContent);
  // requete valide
  if (!req.body.content) {
      res.status(400).send({ message: "Le contenu est requis !." });
      return;
  }

  // Creation post
  const post = {
    content: req.body.content,
    description: req.body.description,
    //userId: req.body.userId,
    postFkUserId: req.body.postFkUserId
  };
  console.log(post);

  // Sauvegarde post dans Bd
  db.posts.create(post)
  
    .then(data => { res.send(data) })
    .catch(err => { res.status(500).send({ message: err.message || "Une erreur est survenue pendant la création du post." })});
    console.log(post);
};


/***  Export de la fonction RECUPERATION tous les posts (GET) ***/
exports.getAllPosts = (req, res) => {
  const posts = db.posts;
  console.log('posts:', db.posts);
  db.posts.findAll({ include: [
    {
      model: db.comments, 
      as: 'comments',
      include: ['comment_fk_user']
    },
    "post_fk_user"
  ],
  })
  .then(posts => res.status(200).json(posts))
  .catch(error => res.status(400).json({ error: error.message }));
};

/***  Export de la fonction RECUPERATION tous les posts d'un utilisateur (GET) ***/
exports.getAllPostFromOneUser = (req, res) => {
  const id = req.params.userId;

  db.users.findByPk(id, {
    include: [
      { 
        model : db.posts,
        as: 'posts',
        include: [
          { 
            model : db.comments,
            as: 'comments',
            include : [ "comment_user"]
          },
        ],
      },
    ]
  })
  .then((post) => { res.status(200).json(post) })
  .catch((error) => { res.status(400).json({ error: error.message })});
};

/*** Export de la fonction récupération d'un post (GET) ***/
exports.getOnePost = (req, res) => {
  db.posts.findOne({where :{ id: req.params.id }}) // = cherche ds db le post dont l'id correspond
  .then(postResponse => res.status(200).json(postResponse))
  .catch(error => res.status(400).json({ error: error.message }));
};

/*** Export de la fonction MODIFICATION post (PUT) ***/
exports.modifyPost = async (req, res) => {
  try {
  // Récupère l'id de l'utilisateur effectuant la requête
  const reqUser = req.user;
  console.log('reqUser:', reqUser);
  const postId = req.params.id;
  const newPost = req.body;
  console.log(  reqUser.userId);
  
  // cherche l'user dans la bdd grâce à son id
  const User = await db.users.findOne({ where : {id: reqUser.userId }})

  // Si cet id n'est pas trouvé
  if(!User) {
    return res.status(401).json({ error: 'Utilisateur non trouvé !'}); 

    // Si ok, vérifie que les rôles correspondent
  } else if (reqUser.userRole !== User.role) {
    return res.status(403).json({ message: ` Vous n'êtes pas autorisé à effectuer cette action.` })

    // Si ok cherche le post concerné
  } else {
    const Post = await db.posts.findByPk(postId)

    // Si non trouvé
    if( !Post ) {
      return res.status(400).json({ message: ` Post non trouvé.` })

      // Si ok, vérifie si admin ou créateur du post
    } else if (reqUser.userRole === "admin" || User.id === Post.postFkUserId)

    // modifie le post
    Post.update({...newPost})
    .then(() => res.status(200).json({ message: 'Post modifié !'}))
    .catch(error => res.status(400).json({error: error.message || `Une erreur s'est produite pendant la modification du post` }));
  }       
  }
  catch(error) {
    return res.status(500).json({ error: error.message })
  }
}


exports.deletePost = async (req, res) => {
  try {
  const reqUser = req.user;
  console.log(reqUser);
  const postId = req.params.id;
  console.log(reqUser.userId);

  // cherche l'user dans la bdd grâce à son id
  const User = await db.users.findOne({ where : {id: reqUser.userId }})
  
  // Si cet id n'est pas trouvé
  if(!User) {
    return res.status(401).json({ error: 'Utilisateur non trouvé !'}); 

    // Si ok, vérifie que les rôles correspondent
  } else if (reqUser.userRole !== User.role) {
    return res.status(403).json({ message: ` Vous n'êtes pas autorisé à effectuer cette action.` })

    // Si ok cherche le post concerné
  } else {
    const Post = await db.posts.findByPk(postId)

      // Si non trouvé
      if( !Post ) {
        return res.status(400).json({ message: ` Post non trouvé.` })

      // Si ok, vérifie si admin ou créateur du post
    } else if (reqUser.userRole === "admin" || User.id === Post.postFkUserId){

      // si ok : supprime post
      Post.destroy() 
        .then(() => res.status(200).json({ message:'Post supprimé !'}))
        .catch(error => res.status(400).json({ error: error.message || `Une erreur s'est produite pendant la suppression du post.` }));
    } else {

      // Sinon
      return res.status(403).json({ message: ` Vous n'êtes pas autorisé à effectuer cette action.` })
    }  
  }  
  }
  catch (err) {
    return res.status(500).json({ err })
  }
}
 

  