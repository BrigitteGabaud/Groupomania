"use strict";

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.USER,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: 'mariadb',
    operatorsAliases: false,

    pool: {
      max: 5, // max pool connex
      min: 0, // min pool connex
      acquire: 30000, // tps max connex inactive avant d'être libérée (milli sec)
      idle: 10000,    // durée max tentative connex avant erreur
    },
  }
);

const db = {}; // crée objet représentant models

db.Sequelize= Sequelize;// ref bibliothèque Sequelize
db.sequelize = sequelize; // ref instance sequelize

// ajoute une nouvelle valeur dans l'objet (= mot clé)
db.users = require('./user-model')(sequelize, Sequelize);
db.posts = require('./post-model')(sequelize, Sequelize);
db.comments = require('./comment-model')(sequelize, Sequelize);

// Ajout clés étrangères

db.users.hasMany(db.posts, { foreignKey: "userId", as: "posts", onDelete: 'CASCADE' });
db.posts.belongsTo(db.users, {
  foreignKey: "userId", // crée FK 'userId' dans posts
  as: "post_fk_user", // Si je veux l'appeler dans back
});

db.users.hasMany(db.comments, { foreignKey: "userId", as: "comments", onDelete: 'CASCADE' });
db.comments.belongsTo(db.users, {
  foreignKey: "userId", // crée FK 'userId' dans comments
  as: "comment_fk_user" // Si je veux l'appeler dans back
});

db.posts.hasMany(db.comments, { foreignKey: "postId", as: "comments", onDelete: 'CASCADE' });
db.comments.belongsTo(db.posts, {
  foreignKey: "postId", // crée FK 'postId' dans comments
  as: "comment_fk_post", // Si je veux l'appeler dans back
});





//Execution
module.exports = db;