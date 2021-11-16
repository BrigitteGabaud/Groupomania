"use strict";

/** Déclaration modele role **/
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("roles", {
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    }, {
      timestamps: false
    });
  }; 