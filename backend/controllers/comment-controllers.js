"use strict";
/* Import dépendances */
const jwt = require('jsonwebtoken'); // package génération + vérif token

/* Import dossier models */
const db = require('../models');

/*** Creation commentaire ***/

exports.createComment = (req, res) => {
  
  // Creation comment:! ce queje reçois du front
  const comment = {
    content: req.body.content,
    userId: req.user.userId,
    postId: req.params.postId,
  };

  if (comment.content == undefined) {
      res.status(400).send({ message: `Le contenu est requis !.` });
      return;
  }
  console.log(comment);

  // bd.table.chrch elemt (où: {colonne: ligne})
  db.posts.findOne({where: {id: comment.postId}})
    .then((posts) => {
      if(!posts.id)  {
        return res.status(404).json({ message: ` Post non trouvé !` })
      }
      // Sauvegarde post dans Bd
      return db.comments.create(comment)
    })
    .then(commentResponse => { res.send(commentResponse) })
    .catch(err => { res.status(500).send({ message: err.message || "Une erreur est survenue pendant la création du commentaire." })});
  
}

// /*** Export de la fonction récupération de tous les commentaires d'un post par le postId (GET) ***/
exports.getAllCommentsOfAPost = async (req, res) => {
  const reqPostId = req.params.postId

  try {
    const Post = await db.posts.findByPk( reqPostId )

    .then(Post => {
      if(!Post) {
        return res.status(404).json({ error: 'Post non trouvé !'}); 
      } else {
        return db.comments.findAll({where: { postId : reqPostId } })
      }
    })
    
    .then(Comments => {
      console.log('COMMENTS', Comments);
      return res.status(200).json( Comments )
      
    })

    .catch(error => res.status(500).json({ message: error.message }));
  }
  catch(err) {
    return res.status(500).json({ err: error.message })
  }
}

/*** Export de la fonction récupération d'un commentaire par l'userId (GET) ***/
exports.getOneComment = (req, res) => {
    const id = req.params.id;

    db.comments.findByPk(id, {include: ["users"]}) // = cherche ds db l'user dont l'id correspond
    .then(commentResponse => res.status(200).json(commentResponse))
    .catch(error => res.status(400).json({ error: error.message }));
};


/*** Export de la fonction MODIFICATION commentaire (PUT) ***/
exports.modifyComment = async (req, res) => {
  try {
    // Récupère l'id de l'utilisateur effectuant la requête
    const reqUser = req.user;
    const newComment = req.body;
    let reqParams = req.params
    let reqCommentId = reqParams.commentId
    console.log('reqCommentId', reqCommentId);
    

    // cherche l'user dans la bdd grâce à son id
    const User = await db.users.findOne({ where : { id: reqUser.userId }})
    // Si cet id n'est pas trouvé
    if(!User) {
    return res.status(404).json({ error: 'Utilisateur non trouvé !'}); 

    // Si ok, vérifie que les rôles correspondent
    } else if (reqUser.userRole !== User.role) {
      return res.status(403).json({ message: ` L'utilisateur n'est pas autorisé à effectuer cette action.` })

    // Si ok cherche le commentaire concerné
    } 
      const Comment = await db.comments.findOne({ where : { id: reqCommentId }})
      console.log("Comment", Comment);

      // Si non trouvé
      if( !Comment ) {
      console.log('COUCOU ?');
      return res.status(404).json({ message: ` Commentaire non trouvé.` })

      // Si ok, vérifie si admin ou créateur du commentaire
      } else if (reqUser.userRole === "admin" || User.id === Comment.userId){
        console.log('HEEEEERE ?');
        // Modifie le commentaire
        Comment.update({...newComment})
        .then(() => res.status(200).json({ message: 'Commentaire modifié !' }))
        .catch(error => res.status(400).json({ error: error.message || `Une erreur s'est produite pendant la modification du commentaire` }));
      
    }
  }
  catch(error) {
    return res.status(500).json({ error: error.message })
  }
}


/*** Export de la fonction SUPPRESSION commentaire (DELETE) ***/
exports.deleteComment = async (req, res) => {
  try {
    const reqUser = req.user;
    const commentId = req.params.commentId;
    
    // cherche l'user dans la bdd grâce à son id
    const User = await db.users.findOne({ where : {id: reqUser.userId }})

    // Si cet id n'est pas trouvé
    if(!User) {
      return res.status(401).json({ error: 'Utilisateur non trouvé !'}); 
    
     // Si ok, vérifie que les rôles correspondent
    } else if (reqUser.userRole !== User.role) {
      return res.status(403).json({ message: `L'utilisateur n'est pas autorisé à effectuer cette action.` })

    // Si ok cherche le commentaire concerné
    } else {
      const Comment = await db.comments.findByPk(commentId)
      
        // Si non trouvé
        if(!Comment) {
          return res.status(400).json({ message: ` Commentaire non trouvé.` })
          
          // Si ok, vérifie si admin ou créateur du commentaire
        } else if (reqUser.userRole === "admin" || reqUser.userId === Comment.userId){

          // si ok : supprime commentaire
          Comment.destroy() 
            .then(() => res.status(200).json({ message:'Commentaire supprimé !'}))
            .catch(error => res.status(400).json({ error: error.message }));

        } else {
          // Sinon
          return res.status(403).json({ message: `L'utilisateur n'est pas autorisé à effectuer cette action.` })
        }  
    }  
  }
  catch (error) {
    return res.status(500).json({ error: error.message })
  }
}