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

db.users.hasMany(db.posts, { as: "posts" });
db.posts.belongsTo(db.users, {
  foreignKey: "userId",
  as: "users",
});

db.users.hasMany(db.comments, { as: "comments" });
db.comments.belongsTo(db.users, {
  foreignKey: "userId",
  as: "users",
});

db.posts.hasMany(db.comments, { as: "comments" });
db.comments.belongsTo(db.posts, {
  foreignKey: "postId",
  as: "posts",
});



//Execution
module.exports = db;