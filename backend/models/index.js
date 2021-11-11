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

db.user = require('./user-model')(sequelize, Sequelize) // ajoute une nouvelle valeur dans l'objet (= mot clé)

//Execution
module.exports = db;