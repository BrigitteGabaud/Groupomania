"use strict";

/* Import dépendances */
const bcrypt = require('bcrypt'); // package hash password
const jwt = require('jsonwebtoken'); // package génération + vérif token
const fs = require('fs'); // Donne accès aux opérations liées aux syst de fichiers (modif /suppr) 

/* Import schemas joi */
const schemaAuth = require('../schemas/signup-schema');
const schemaLogin = require('../schemas/login-schema');
const schemaUserModify = require('../schemas/userModify-schema');

/* Import dossier models */
const db = require('../models');
const { log } = require('console');


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
      .catch(error => res.status(400).json({ error: error.message }))
    })
    .catch(error => res.status(500).json({ error: error.message })); 
  } catch(err){
    //return res.status(500).json({ err: err.message })
    console.log(err.message)
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

    /* si elle n'y est pas*/    
    if(!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé !'}); 
    }
    /* Compare mdp req à celui db */
    bcrypt.compare(req.body.password, user.password)
    .then(valid => {

      // si différent
        if (!valid) {
          return res.status(401).json({ error: 'Mot de passe incorrect !'});
        }
        res.status(200).json({
          /* Renvoie obj json avec userid/ userRole + token et confirm authentification == frontend */
          userRole: user.role,
          userId: user.id,
          token: jwt.sign( // appel fonction jwt
            { userId: user.id, userRole: user.role  }, // 1er arg = "paylod" avec données à encoder == backend
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

/***  Export de la fonction récupération tous les utilisateurs (GET) ***/
exports.getAllUsers = (req, res) => {
  const Users = db.users;

  Users.findAll()
  .then(users => res.status(200).json(users))
  .catch(error => res.status(400).json({ error }));
};

/*** Export de la fonction récupération d'un utilisateur (GET) ***/
exports.getOneUser = (req, res) => {

  db.users.findOne({where :{ id: req.params.id }}) // = cherche ds db l'user dont l'id correspond
  .then(userResponse => res.status(200).json(userResponse))
  .catch(error => res.status(400).json({ error: error.message }));
};


/*** Export de la fonction modification user (PUT) ***/
exports.modifyUser = async (req, res) => {
  try {
    /* Vérifie si la requête correspond au schemaUserModify */
    const joiValidator = await schemaUserModify.validateAsync(req.body)
    if(!joiValidator){
      return res.status(400).json({ error: 'Modification impossible: certaines données sont incorrectes' })
    }
    console.log('REQ BOODYYYY', req.body);
    // Récupère les données du body
    const newUser = {}
    if(req.body.firstname) {
      newUser.firstname = req.body.firstname
    }
    if(req.body.lastname) {
      newUser.lastname = req.body.lastname
    }
    if(req.body.email) {
      newUser.email = req.body.email
    }
    if(req.body.bio) {
      newUser.bio = req.body.bio;
    }
    // Récupère l'id de l'utilisateur effectuant la requête
    const reqUserId = req.user.userId;
    
    if(req.file) {
      console.log(req.file, 'REQ FILE ****');
      // génère nouvelle image
      newUser.avatar = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }
    console.log('new user', newUser);
    // Cherche l'user concerné dans la BDD 
    db.users.findOne({where :{id: req.params.id}}) 
    .then(User => {
  
      if(!User) {
        return res.status(404).json({ error: "Utilisateur non trouvé !" })
      } 
      if (User.role !== "admin" && User.id !== reqUserId){
        return res.status(401).json({ error: "L'utilisateur ne dispose pas des droits pour effectuer cette modification" })
      }  
      
      // Si fichier img dans la requête
      if(req.file){
          console.log('REQ FILE', req.file);
          const filename = User.avatar.split('/images/')[1];
          console.log('FILENAME', filename);
          console.log('USER AVATAR', User.avatar);
        // if(User.avatar) {
        //   console.log(User.avatar, '/// USER AVATAR ///');
        //   const filename = User.avatar.split('/images/')[1];
        //   console.log('FILENAME', filename);
        //   if(User.avatar !== 'http://localhost:3000/images/default_avatar.png'){
        //   fs.unlink(`images/${filename}`, () => {
        //     // Puis modifie le user
        //     User.update({...newUser})
        //     .then(() => res.status(200).json({ message: 'User modifié !'}))
        //     .catch(error => res.status(400).json({ error: error.message }));
        // })}}

      } else { 
        // Modifie le contenu texte
        User.update({...newUser})
        .then(() => res.status(200).json({ message: 'User modifié !'}))
        .catch(error => res.status(400).json({ error: error.message }));
      }    
    }) 
    .catch(error => res.status(500).json({ error: error.message }))
  }
  catch(err){
    return res.status(500).json({ err: err.message })
  }
}

/*** Export de la fonction supression user (DELETE) ***/
exports.deleteUser = (req, res) => {
  const reqUser = req.user;
  const id = req.params.id;

   db.users.findByPk(id)  
  .then(userResponse => {
    if(!userResponse) {
      return res.status(404).json({message: `Utilisateur non trouvé` })
    }
    // Si l'userId de la BDD est différent de celui de la requête
    if( (userResponse.id !== reqUser.userId) || (userResponse.userRole !== reqUser.role) ) {
      return res.status(403).json({message: `L'utilisateur n'est pas autorisé à effectuer cette action.` })
    }
    /* Accède à l'objet pour récup posts/commentaires/images */
    return db.users.findOne({ where: { id : reqUser.userId }}) 
  })


  .then(User => {
    if (User.role !== "admin" && reqUser.userId !== User.id) {
      return res.status(403).json({ message: `L'utilisateur n'est pas pas autorisé à effectuer cette action.` })
    } else return db.comments.findAll({ where : {userId: reqUser.userId} })
  })

  .then(comments => {
    if(comments) {
      for (let comment in comments) {
        comments[comment].destroy()
      }
    }
    return db.posts.findAll({ where: {userId: reqUser.userId}})
  })

  .then(posts => {
    if(posts) {
      for (let post in posts) {
        if(posts[post].image) {
          const filename = posts[post].image.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {
            posts[post].destroy()
          })
        }
        posts[post].destroy()
      }
    }
    return db.users.findOne({ where: {id: reqUser.userId}})
  })

  .then(user => {
    if(user.avatar !== 'http://localhost:3000/images/default_avatar.png') {
      const filename = user.avatar.split("/images/")[1];
      fs.unlink(`images/${filename}`, (err) => {
        return err ? console.log(err) : console.log('image supprimée !');
      })
    }
    return user.destroy()
  })
  
  .then(() => {
     res.status(200).json({ message: "Utilisateur supprimé !" })
  })

  .catch(error => res.status(500).json({ message: error.message }));
}
