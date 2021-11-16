"use strict";

/** Déclaration modele comment **/
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("comments", {
      content: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: false
    });
  };