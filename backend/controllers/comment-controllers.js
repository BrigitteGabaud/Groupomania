"use strict";
/* Import dépendances */
const jwt = require('jsonwebtoken'); // package génération + vérif token

/* Import dossier models */
const db = require('../models');


/*** Creation commentaire ***/
exports.createComment = (req, res) => {
  // Creation comment
  const comment = {
    content: req.body.content,
    date: req.body.date,
    userId: req.body.userId,
    postId: req.body.postId
  };
    
    // requete valide
    if (!req.body.content) {
        res.status(400).send({ message: "Le contenu est requis !." });
        return;
    }
  
    
    
    // Sauvegarde post dans Bd
    db.comments.create(comment)
      .then(commentResponse => { res.send(commentResponse) })
      .catch(err => { res.status(500).send({ message: err.message || "Une erreur est survenue pendant la création du commentaire." })});
  };


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
    console.log('reqUser:', reqUser);
    const commentId = req.params.id;
    const newComment = req.body;
    console.log("newComment", newComment);
    console.log(  reqUser.userId);
    console.log(commentId);

    // cherche l'user dans la bdd grâce à son id
    const User = await db.users.findOne({ where : {id: reqUser.userId }})

    // Si cet id n'est pas trouvé
    if(!User) {
      return res.status(401).json({ error: 'Utilisateur non trouvé !'}); 

    // Si ok, vérifie que les rôles correspondent
    } else if (reqUser.userRole !== User.role) {
       return res.status(403).json({ message: ` Vous n'êtes pas autorisé à effectuer cette action.` })

    // Si ok cherche le commentaire concerné
    } else {
      const Comment = await db.comments.findByPk(commentId)
      console.log("Comment", Comment);
      // Si non trouvé
      if( !Comment ) {
        return res.status(400).json({ message: ` Commentaire non trouvé.` })

      // Si ok, vérifie si admin ou créateur du commentaire
    } else if (reqUser.userRole === "admin" || User.id === Comment.commentFkUserId)

      // Modifie le commentaire
      Comment.update({...newComment})
      .then(() => res.status(200).json({ message: 'Commentaire modifié !'}))
      .catch(error => res.status(400).json({error: error.message || `Une erreur s'est produite pendant la modification du commentaire`}));
      }
  }
  catch(error) {
    return res.status(500).json({ error: error.message })
  }
}


/*** Export de la fonction SUPPRESSION post (DELETE) ***/
// to do 
exports.deleteComment = async (req, res) => {
  try {
    const reqUser = req.user;
    console.log("reqUser", reqUser );
    const postId = req.params.id;
    console.log(reqUser.userId);
    
    // cherche l'user dans la bdd grâce à son id
    const User = await db.users.findOne({ where : {id: reqUser.userId }})
    console.log("User" ,User);
    console.log("reqUser.userRole",reqUser.userRole);
    console.log("User.role", User.role);
    console.log(reqUser.userRole !== User.role);
    // Si cet id n'est pas trouvé
    if(!User) {
     
    return res.status(401).json({ error: 'Utilisateur non trouvé !'}); 

    
     // Si ok, vérifie que les rôles correspondent
    } else if (reqUser.userRole !== User.role) {
      console.log("reqUser.userRole",typeof reqUser.userRole);
      console.log("User.role",typeof User.role);

      return res.status(403).json({ message: ` Vous n'êtes paaaaas autorisé à effectuer cette action.` })

    // Si ok cherche le commentaire concerné
  } else {
    const Comment = await db.comments.findByPk(postId)
    console.log(Comment);
    console.log(reqUser.userRole === "admin");
    console.log(Comment.id === Comment.commentFkUserId);
    console.log(Comment.id);
    console.log(Comment.commentFkUserId);
    // Si non trouvé
    if( !Comment ) {
      return res.status(400).json({ message: ` Commentaire non trouvé.` })
      
      // Si ok, vérifie si admin ou créateur du commentaire
    } else if (reqUser.userRole === "admin" || reqUser.userId === Comment.commentFkUserId){

      // si ok : supprime commentaire
      Comment.destroy() 
        .then(() => res.status(200).json({ message:'Commentaire supprimé !'}))
        .catch(error => res.status(400).json({ error: error.message }));
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