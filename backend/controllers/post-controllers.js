/* Import dépendances */
const bcrypt = require('bcrypt'); // package hash password
const jwt = require('jsonwebtoken'); // package génération + vérif token
//const schemaAuth = require('../schema/schemaAuth')
const fs = require('fs'); // Donne accès aux opérations liées aux syst de fichiers (modif /suppr) 


/* Import dossier models */
const db = require('../models');
const Op = db.Sequelize.Op;

/*** Creation post  ***/
exports.createPost = (req, res) => {
    // requete valide
    if (!req.body.content) {
        res.status(400).send({ message: "Le contenu est requis !." });
        return;
    }
  
    // Creation post
    const post = {
      content: req.body.content,
      description: req.body.description
    };
  
    // Sauvegarde post dans Bd
    db.post.create(post)
      .then(data => { res.send(data) })
      .catch(err => { res.status(500).send({ message: err.message || "Une erreur est survenue pendant le création du post." })});
  };

/***  Export de la fonction RECUPERATION tous les utilisateurs (GET) ***/
exports.getAllPosts = (req, res) => {
    const posts = db.post;
    console.log('posts:' ,posts);
    db.post.findAll()
    .then(posts => res.status(200).json(posts))
    .catch(error => res.status(400).json({ error: error.message }));
};

/*** Recupération d'un post ***/
exports.getOnePost = (req, res) => {
    db.post.findOne({where :{ id: req.params.id }}) // = cherche ds db l'user dont l'id correspond
    .then(postResponse => res.status(200).json(postResponse))
    .catch(error => res.status(400).json({ error: error.message }));
};

/*** Export de la fonction MODIFICATION post (PUT) ***/
exports.modifyPost = (req, res) => {
    // Récupère l'id de l'utilisateur effectuant la requête
    const reqUserId = req.user.userId;
    console.log('reqUserId:', reqUserId);
    const id = req.params.id;
    
    // Cherche le post concerné dans la BDD 
    db.post.findByPk(id) 
    .then(postResponse => {
      console.log('postResponse : ' ,postResponse);
        // Si l'userId de la BDD correspond à celui de la requête
        if(postResponse.id == reqUserId ) {
          console.log('postResponse.id :' , postResponse.id);
            /* Le post est modifié */
            // Y a t-il une requête pour un fichier image ? 
            const postObject = req.file ?
            {
            // Récupère toutes les informations du post
            ...JSON.parse(req.body.post), 
            // Génère l'image url
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            // = Si req.file n'existe pas: on prend le corps de la requête
            } : { ...req.body}; 
            // modifie l'identifiant de l'objet créé
            postResponse.update({...postObject})
            .then(() => res.status(200).json({ message: 'Post modifié !'}))
            .catch(error => res.status(400).json({error: error.message }));
        } else {
            /*Sinon envoie un message d'erreur et arrête le code (return)*/
            return res.status(403).json({message:  `403: unauthorized request `})
        }
            
    })
    .catch(error => res.status(500).json({ error: error.message }))
  }

/*** Export de la fonction SUPPRESSION post (DELETE) ***/
// to do 
exports.deletePost = (req, res) => {
    const reqUserId = req.user.userId;
    console.log('reqUserId:', reqUserId);
    const id = req.params.id;
  
    db.post.findByPk(id) 
    .then(postResponse => {
      console.log(postResponse);
      // Si l'userId de la BDD correspond à celui de la requête
      if(postResponse.id == reqUserId ) {
            console.log('postResponse.id :', postResponse.id);
        // Le post est supprimé
        /* Accède à l'objet pour récup url image + nom fichier */
        db.post.findByPk(id) 
        /* callback récupère sauce + nom exact fichier */
        .then(post => {
          console.log('POST: ' ,post);
         
            /* Extrait nom du fichier à suppr :Récupère imageUrl sauce retournée / base + split autour '/images/' et retourne tableau de 2 elmts avant/ après /images/ */
            //const filename = user.avatar.split('/images/')[1];
            /* Fonction suppression fichier: 1er arg= chemin fichier 2e = callback (que faire une fois fichier suppr ? = suppr objet dans la base) */
            /* fs.unlink(`images/${filename}`, (err) => {
              err ? console.log(err) : console.log( 'Image supprimée');
            }) */
            db.post.destroy({ where: { id : req.params.id }}) 
              .then(() => res.status(200).json({ message:'Post supprimé !'}))
              .catch(error => res.status(400).json({ error: error.message }));
        })
        .catch(error => res.status(500).json({ message: error.message }));
      } else {
        // Sinon renvoie une erreur et stoppe le code
        return res.status(401).json({message: '401: unauthorized request' })
      }
    })
  }
  