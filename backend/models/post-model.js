"use strict";

/** Déclaration modele post **/
module.exports = (sequelize, DataTypes) => {
    
    /* Méthode 'define + 3 params:
        1. 'users' = nom modele --> sequelize créera table 'users'
        2. ligne7 à ligne25 = propriétés du modèle --> colonnes de la table */
    return sequelize.define('posts', {
        id: {
            type: DataTypes.INTEGER, 
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        userId: {
            type: DataTypes.INTEGER, 
            allowNull: false,
            references: {
                model: "users",
                key: "id"
            }
        }
    }, {
    /* 3. option de paramétrage global */
        timestamps: true, 
        createdAT: true, // date création
        updateAt: true   // date modification
    })
}