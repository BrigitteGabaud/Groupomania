"use strict";

/* Import dépendances */
const fs = require('fs'); // Donne accès aux opérations liées aux syst de fichiers (modif /suppr) 

/* Import dossier models */
const db = require('../models');


/*** Creation post  ***/
exports.createPost = (req, res) => {
  const postInfos = req.body

  // Creation post = ce que je reçois du front
  let post = {
    content: postInfos.content,
    userId: req.user.userId
  };

  if(req.file)
  {
    // Génère l'image url
    post.image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } 

  // Sauvegarde post dans Bd
  db.posts.create(post)
  
    .then(data => { res.send(data) })
    .catch(err => { res.status(500).send({ message: err.message })});
};


/***  Export de la fonction récupération tous les posts (GET) ***/
exports.getAllPosts = (req, res) => {
  const posts = db.posts;
  
  posts.findAll({ 
    include: [
    {
      model: db.comments, 
      as: 'comments',
      include: ['comment_fk_user']
    },
    "post_fk_user"
    ],
    order: [
      ['createdAt', 'DESC']
    ]
  })
  .then(posts => res.status(200).json(posts))
  .catch(error => res.status(400).json({ error: error.message }));
};

/***  Export de la fonction récupération tous les posts d'un utilisateur (GET) ***/
exports.getAllPostsOfOneUser = (req, res) => {
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
            include : [ "comment_fk_user"]
          },
        ],
        order: [
          ['createdAt', 'DESC']
        ]
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

/*** Export de la fonction modification post (DELETE) ***/
exports.modifyPost = async (req, res) => {
  try {
    // Récupère les informations de la requête
    const reqUser = req.user;
    const postId = req.params.id;
    const newPost = req.body;
    
    // cherche l'user dans la bdd grâce à son id
    const User = await db.users.findOne({ where : {id: reqUser.userId }})
  
    // Si cet id n'est pas trouvé
    if(!User) {
      return res.status(404).json({ error: 'Utilisateur non trouvé !'}); 
    } 
    // Si ok, vérifie que les rôles correspondent (user de la req et user ds db)
    if (reqUser.userRole !== User.role) {
      return res.status(403).json({ message: `L'utilisateur n'est pas autorisé à effectuer cette action.` })
    } 

    // Si ok cherche le post concerné avec son id
    const Post = await db.posts.findByPk(postId)

    // Si non trouvé
    if(!Post) {
      return res.status(404).json({ message: ` Post non trouvé.` })

    // Si ok, vérifie si admin ou créateur du post
    } else if (reqUser.userRole !== "admin" && User.id !== Post.userId){
      return res.status(401).json({ error: "L'utilisateur n'est pas autorisé à effectuer cette action." })
    }  
    // Si ok et si le post modifié contient une image
    if(req.file) {
      
      // Génère la nouvelle image url
      newPost.image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

      // Supprime l'ancienne image du dossier 
      const filename = Post.image.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {

        // Puis modifie le post
        Post.update({...newPost})
        .then(() => res.status(200).json({ message: 'Post modifié !'}))
        .catch(error => res.status(400).json({ error: error.message }));
      })
      
    // Si le post modifié ne contient pas d'image
    } else { 

      // Modifie le contenu texte
      Post.update({...newPost})
      .then(() => res.status(200).json({ message: 'Post modifié !'}))
      .catch(error => res.status(400).json({ error: error.message }));
    }    
  }
  catch(error) {
    return res.status(500).json({ error: error.message })
  }
}

/*** Export de la fonction supression post (PUT) ***/
exports.deletePost = async (req, res) => {
  try {
    const reqUser = req.user;
    const postId = req.params.id;

    // cherche l'user dans la bdd grâce à son id
    const User = await db.users.findOne({ where : {id: reqUser.userId }})

    // Si cet id n'est pas trouvé
    if(!User) {
      return res.status(404).json({ error: 'Utilisateur non trouvé !'}); 

      // Si ok, vérifie que les rôles correspondent
    } else if (reqUser.userRole !== User.role) {
      return res.status(403).json({ message: `L'utilisateur n'est pas pas autorisé à effectuer cette action.` })

      // Si ok cherche le post concerné
    } else  {
      const Post = await db.posts.findByPk(postId)

        // Si non trouvé
        if( !Post ) {
          return res.status(404).json({ message: `Post non trouvé.` })

        // Si ok, vérifie si admin ou créateur du post
        } else if (reqUser.userRole === "admin" || User.id === Post.userId) {

          // Si pas d'image
          if(!Post.image) {
            // Supprime le contenu du post
            Post.destroy() 
              .then(() => res.status(200).json({ message:'Post supprimé !'}))
              .catch(error => res.status(400).json({ error: error.message }));
          } else {

            // Si image la supprime du dossier
            const filename = Post.image.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {

              // Puis supprime le post
              Post.destroy() 
              .then(() => res.status(200).json({ message:'Post supprimé !'}))
              .catch(error => res.status(400).json({ error: error.message || `Une erreur s'est produite pendant la suppression du post.` }));
            })
          }
            
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
 

  