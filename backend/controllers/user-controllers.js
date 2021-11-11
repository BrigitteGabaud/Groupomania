/* Import dépendances */
const bcrypt = require('bcrypt'); // package hash password
const jwt = require('jsonwebtoken'); // package génération + vérif token
//const schemaAuth = require('../schema/schemaAuth')

/* Import dossier models */
const db = require('../models');


/* Export de la fonction inscription */
exports.signup = async (req, res) => {
  try{
     /* Vérifie si la requête correspond au schémaAuth */
     const joiValidator = await schemaAuth.validateAsync(req.body)
     if(!joiValidator){
       return res.status(400).json({ error })
     }
     /* cherche user dans db par son ad mail */
     const emailDb = await db.user.findOne({ wher:{ email: req.body.email }})

     /* vérifie si elle est unique*/
     if(emailDb) {
         return  res.status(403).json({ error: 'Adresse mail déjà enregistrée.'})
     };
     /* Hache le mot de passe 10x */    
     bcrypt.hash(req.body.password, 10)
        
     .then(hash => {
         /* création utilisateur */
         const user = {
             email: req.body.email,
             password: hash
         }
         db.user.create(user) // enregistrement utilisateur dans db
         .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
         .catch(error => res.status(400).json({ error }))
     })
     .catch(error => res.status(500).json({ error })); 
  } catch(err){
    return res.status(500).json({ err })
  }
    
}

/* Export de la fonction authentification */
exports.login = async (req, res)=> {
  try{
      /* Vérifie si la requête correspond au schémaAuth */
      const joiValidator = await schemaAuth.validateAsync(req.body)
      if(!joiValidator){
        return res.status(400).json({ error })
      }
      /* cherche user dans db par son ad mail */
      const user = await user.db.findOne({ where:{ email: req.body.email }})
      /* vérifie si elle est unique*/    
      if(!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !'}); 
      }
      /* Compare mdp req à celui db */
      bcrypt.compare(req.body.password, user.db.password)
      .then(valid => {
          if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !'});
          }
          res.status(200).json({
              /* Renvoie obj json avec user id + token et confirm authentification */
              userId: user.db._id,
              token: jwt.sign( // appel fonction jwt
                  { userId: user.db._id }, // 1er arg = "paylod" avec données à encoder
                  //'RANDOM_SECRET_TOKEN',
                  process.env.SECRET_KEY_JWT, // 2e arg = clé secrète pour encodage
                  { expiresIn: '8h'} // 3e arg config delai expiration token
              )
          });
      }) 
      .catch(error => res.status(500).json({ message: error.message}))
  }
  catch(err){
      return res.status(500).json({ err })
  }
};