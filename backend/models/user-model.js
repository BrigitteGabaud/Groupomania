"use strict";
const role = {
    Admin: 'admin',
    Basic: 'basic'
};

/** Déclaration modele user **/

/* Export fonction + 2 params: 
    1. 'sequelize'= objet représentant connexion BDD : possède méthode 'define' pour créer un nveau modele
    2. 'DataTypes'= parametre permettant de définir types de données de chaque propriété du modèle */
module.exports = (sequelize, DataTypes) => {
    
    /* Méthode 'define + 3 params:
        1. 'users' = nom modele --> sequelize créera table 'users'
        2. ligne7 à ligne25 = propriétés du modèle --> colonnes de la table */
    return sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER, 
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        firstname: {
            type: DataTypes.STRING(70),
            allowNull: false,
            validate: {
                notNull: {msg: 'Le champ Prénom est requis.'}
            }
        },
        lastname: {
            type: DataTypes.STRING(70),
            allowNull: false,
            validate: {
                notNull: {msg: 'Le champ Nom est requis.'}
            }
        },
        email: {
            type: DataTypes.STRING(120),
            unique: 'email_unique',
            allowNull: false,
            validate: {
                notNull: {msg: 'Le champ Email est requis.'}
            }
        },
        password: {
            type: DataTypes.STRING(120),
            allowNull: false,
            validate: {
                notNull: {msg: 'Le champ Mot de passe est requis.'}
            }
        },
        role: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: role.Basic
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ('../images/DefaultUser.html')
        },
        bio: {
            type: DataTypes.STRING(255),
            allowNull: true,
        }
    }, {
    /* 3. option de paramétrage global */
        timestamps: true, 
        createdAT: true, // date création
        updateAt: true   // date modification
    })
}