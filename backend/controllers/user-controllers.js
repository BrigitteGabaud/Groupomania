"use strict";
/* Import dépendances */
const bcrypt = require('bcrypt'); // package hash password
const jwt = require('jsonwebtoken'); // package génération + vérif token
const fs = require('fs'); // Donne accès aux opérations liées aux syst de fichiers (modif /suppr) 

/* Import schemas joi */
const schemaAuth = require('../schemas/signup-schema');
const schemaLogin = require('../schemas/login-schema');


/* Import dossier models */
const db = require('../models');

/*** Export de la fonction inscription ***/
exports.signup = async (req, res) => {
  try{
    /* Vérifie si la requête correspond au schémaAuth */
    const joiValidator = await schemaAuth.validateAsync(req.body)
    if(!joiValidator){
      return res.status(400).json({ error: 'Format adresse mail ou mot de passe incorrect' })
    }
    /* cherche user dans db par son ad mail */
    const emailDb = await db.users.findOne({ where:{ email: req.body.email }})

    /* vérifie si elle est unique*/
    if(emailDb) {
      return  res.status(403).json({ error: 'Adresse mail déjà enregistrée.'})
    };
    /* Hache le mot de passe 10x */    
    bcrypt.hash(req.body.password, 10)
      
    .then(hash => {
      /* création utilisateur */
      const user = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hash
      }
      db.users.create(user) // enregistrement utilisateur dans db
      .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
      .catch(error => res.status(400).json({ error: `L'utilisateur n'a pas pu être enregistré.` }))
    })
    .catch(error => res.status(500).json({ error: `L'utilisateur n'a pas pu être créé.` })); 
  } catch(err){
    return res.status(500).json({ err })
  }
    
}

/***  Export de la fonction authentification ***/
exports.login = async (req, res)=> {
  try{
    /* Vérifie si la requête correspond au schémaAuth */
      const joiValidator = await schemaLogin.validateAsync(req.body)
      if(!joiValidator){
        return res.status(400).json({ error: 'Format adresse mail ou mot de passe incorrect' })
      }
    /* cherche user dans db par son ad mail */
    const user = await db.users.findOne({ where:{ email: req.body.email }})
    console.log(user);
    /* vérifie si elle est unique*/    
    if(!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !'}); 
    }
    /* Compare mdp req à celui db */
    bcrypt.compare(req.body.password, user.password)
    .then(valid => {
        if (!valid) {
          return res.status(401).json({ error: 'Mot de passe incorrect !'});
        }
        res.status(200).json({
          /* Renvoie obj json avec user id + token et confirm authentification */
          userId: user.id,
          token: jwt.sign( // appel fonction jwt
            { userId: user.id }, // 1er arg = "paylod" avec données à encoder
            //'RANDOM_SECRET_TOKEN',
            process.env.SECRET_KEY_JWT, // 2e arg = clé secrète pour encodage
            { expiresIn: '8h'} // 3e arg config delai expiration token
          )
        });
    }) 
    .catch(error => res.status(500).json({ message: error.message}))
  }
  catch(err){
      return res.status(500).json({ err: err.message })
  }
};

/***  Export de la fonction RECUPERATION tous les utilisateurs (GET) ***/
exports.getAllUsers = (req, res) => {
  const Users = db.users;
  console.log('users:' ,Users);
  Users.findAll()
  .then(users => res.status(200).json(users))
  .catch(error => res.status(400).json({ error }));
};

/*** Export de la fonction RECUPERATION un utilisateur (GET) ***/
exports.getOneUser = (req, res) => {
  db.users.findOne({where :{ id: req.params.id }}) // = cherche ds db l'user dont l'id correspond
  .then(userResponse => res.status(200).json(userResponse))
  .catch(error => res.status(400).json({ error }));
};


/*** Export de la fonction MODIFICATION user (PUT) ***/
exports.modifyUser = (req, res) => {
  // Récupère l'id de l'utilisateur effectuant la requête
  const reqUserId = req.user.userId;
  console.log('reqUserId:', reqUserId);
  
  // Cherche l'user concerné dans la BDD 
  db.users.findOne({where :{id: req.params.id}}) 
  .then(userResponse => {
    console.log('userResponse : ' ,userResponse);
      // Si l'userId de la BDD correspond à celui de la requête
      if(userResponse.id == reqUserId ) {
        console.log('userResponse.id :' , userResponse.id);
          /* L'user est modifié */
          // Y a t-il une requête pour un fichier image ? 
          const userObject = req.file ?
          {
          // Récupère toutes les informations du user
          ...JSON.parse(req.body.user), 
          // Génère l'image url
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
          // = Si req.file n'existe pas: on prend le corps de la requête
          } : { ...req.body}; 
          // modifie l'identifiant de l'objet créé
          userResponse.update({...userObject})
          .then(() => res.status(200).json({ message: 'User modifié !'}))
          .catch(error => res.status(400).json({error: error.message }));
      } else {
          /*Sinon envoie un message d'erreur et arrête le code (return)*/
          return res.status(403).json({message:  `403: unauthorized request `})
      }
          
  })
  .catch(error => res.status(500).json({ error: error.message }))
}

/*** Export de la fonction SUPPRESSION user (DELETE) ***/
// to do : penser à suppr post etc
exports.deleteUser = (req, res) => {
  const reqUserId = req.user.userId;
  console.log('reqUserId:', reqUserId);
  const id = req.params.id;

  db.users.findByPk(id) 
  .then(userResponse => {
   
    // Si l'userId de la BDD correspond à celui de la requête
    if(userResponse.id == reqUserId ) {
          console.log('userResponse.id :', userResponse.id);
      // La sauce est supprimée
      /* Accède à l'objet pour récup url image + nom fichier */
      db.users.findOne({ where: { id : req.params.id }}) 
      /* callback récupère sauce + nom exact fichier */
      .then(user => {
        console.log('USER: ' ,user);
        console.log('USER avatar :' , user.avatar);
          /* Extrait nom du fichier à suppr :Récupère imageUrl sauce retournée / base + split autour '/images/' et retourne tableau de 2 elmts avant/ après /images/ */
          const filename = user.avatar.split('/images/')[1];
          /* Fonction suppression fichier: 1er arg= chemin fichier 2e = callback (que faire une fois fichier suppr ? = suppr objet dans la base) */
          fs.unlink(`images/${filename}`, (err) => {
            err ? console.log(err) : console.log( 'Image supprimée');
          })
          db.users.destroy({ where: { id : req.params.id }}) 
            .then(() => res.status(200).json({ message:'User supprimé !'}))
            .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ message: error.message }));
    } else {
      // Sinon renvoie une erreur et stoppe le code
      return res.status(401).json({message: '401: unauthorized request' })
    }
  })
  .catch(error => res.status(500).json({ message: error.message }));
}
