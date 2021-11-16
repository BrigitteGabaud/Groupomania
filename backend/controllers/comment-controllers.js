"use strict";
/* Import dépendances */
const jwt = require('jsonwebtoken'); // package génération + vérif token

/* Import dossier models */
const db = require('../models');


/*** Creation commentaire ***/
exports.createComment = (req, res) => {
    const commentData = req.body
    console.log(commentData);
    // requete valide
    if (!req.body.content) {
        res.status(400).send({ message: "Le contenu est requis !." });
        return;
    }
  
    // Creation comment
    const comment = {
      content: commentData.content,
      date: commentData.date,
      userId: commentData.userId,
      postId: commentData.postId
    };
  
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
exports.modifyComment = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    console.log("token: ",token);
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY_JWT);
    console.log("decoded T : " ,decodedToken);
    const userId = decodedToken.userId
    console.log("userId : " ,userId);

    // Récupère l'id de l'utilisateur effectuant la requête
    const id = req.params.id;
    console.log(id);
    const commentObject = req.body.comment
    
    // Cherche le post concerné dans la BDD 
    db.comments.findByPk(id, {include: "users"}) 
    .then(oldComment => {
      console.log('oldComment : ' ,oldComment);
        // Si l'userId de la BDD ne correspond pas à celui de la requête
        if( !oldComment.id == userId ) {
          console.log('oldComment.id :' , oldComment.id);
             /* envoie un message d'erreur et arrête le code (return)*/
             return res.status(403).json({message: `Vous devez être l'auteur du commentaire pour pouvoir le modifier.` })
        }
        /* Le post est modifié */
        // modifie l'identifiant de l'objet créé
        oldComment.update({...commentObject}, {where: { id:id}})
        .then(() => res.status(200).json({ message: 'Commentaire modifié !'}))
        .catch(error => res.status(400).json({error: error.message || `Une erreur s'est produite pendant la modification du commentaire`}));
    })
    .catch(error => res.status(500).json({ error: error.message }))
}

/*** Export de la fonction SUPPRESSION post (DELETE) ***/
// to do 
exports.deleteComment = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    console.log("token: ",token);
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY_JWT);
    console.log("decoded T : " ,decodedToken);
    const userId = decodedToken.userId
    console.log("userId : " ,userId);

    // Récupère l'id de l'utilisateur effectuant la requête
    const id = req.params.id;
    console.log(id);
  
    db.posts.findByPk(id, { include: "users" }) 
    .then(commentResponse => {
      console.log(commentResponse);
      // Si l'userId de la BDD correspond à celui de la requête
      if(commentResponse.id == userId ) {
            console.log('commentResponse.id :', commentResponse.id);
        // Le comment est supprimé
        /* Accède à l'objet pour récup url image + nom fichier */
        db.comments.findByPk(id) 
        /* callback récupère sauce + nom exact fichier */
        .then(comment => {
          console.log('comment: ', comment);
         
            db.comments.destroy({ where: { id : id }}) 
              .then(() => res.status(200).json({ message:'Commentaire supprimé !'}))
              .catch(error => res.status(400).json({ error: error.message || `Une erreur s'est produite pendant la suppression du commentaire` }));
        })
        .catch(error => res.status(500).json({ message: error.message }));
      } else {
        // Sinon renvoie une erreur et stoppe le code
        return res.status(401).json({message: '401: unauthorized request' })
      }
    })
  }
  