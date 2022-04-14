-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : jeu. 14 avr. 2022 à 08:34
-- Version du serveur :  10.4.13-MariaDB
-- Version de PHP : 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `groupomania`
--

-- --------------------------------------------------------

--
-- Structure de la table `comments`
--

DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `userId` int(11) NOT NULL,
  `postId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `postId` (`postId`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf16;

--
-- Déchargement des données de la table `comments`
--

INSERT INTO `comments` (`id`, `content`, `userId`, `postId`, `createdAt`, `updatedAt`) VALUES
(30, 'Merci !', 6, 23, '2022-04-14 08:30:54', '2022-04-14 08:30:54'),
(31, 'Wouah ! où est-ce ?', 6, 18, '2022-04-14 08:33:49', '2022-04-14 08:33:49');

-- --------------------------------------------------------

--
-- Structure de la table `posts`
--

DROP TABLE IF EXISTS `posts`;
CREATE TABLE IF NOT EXISTS `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `userId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf16;

--
-- Déchargement des données de la table `posts`
--

INSERT INTO `posts` (`id`, `content`, `image`, `userId`, `createdAt`, `updatedAt`) VALUES
(18, 'Mon lieu de méditation préféré...', 'http://localhost:3000/images/bernd-dittrich-TDW_QmqJYcM-unsplash.jpg1649924685793.jpg', 1, '2022-04-12 18:30:31', '2022-04-14 08:28:15'),
(19, 'Mon futur voyage !', 'http://localhost:3000/images/john-fowler-9qgKQewttVs-unsplash.jpg1649924795939.jpg', 1, '2022-04-12 18:31:53', '2022-04-14 08:27:05'),
(20, '\"Ce qui compte, ce n\'est pas la destination mais le chemin ;-) \"', 'http://localhost:3000/images/vers-la-plage.jpg1649839192994.jpg', 6, '2022-04-13 08:39:25', '2022-04-14 08:33:19'),
(21, 'Coucou de Chine !', 'http://localhost:3000/images/espaliers.jpg1649839178090.jpg', 6, '2022-04-13 08:39:38', '2022-04-14 08:30:01'),
(23, 'Pour vous :)', 'http://localhost:3000/images/curioso-photography-U2cO6cDJhik-unsplash.jpg1649924711657.jpg', 1, '2022-04-13 17:10:17', '2022-04-14 08:25:47');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(70) NOT NULL,
  `lastname` varchar(70) NOT NULL,
  `email` varchar(120) NOT NULL,
  `password` varchar(120) NOT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'user',
  `avatar` varchar(255) NOT NULL DEFAULT 'http://localhost:3000/images/default_avatar.png',
  `bio` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`,`role`),
  UNIQUE KEY `email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf16;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `email`, `password`, `role`, `avatar`, `bio`, `createdAt`, `updatedAt`) VALUES
(1, 'Mary', 'Sophia', 'mary@mail.com', '$2b$10$uKPswmpTUxvE97wL2thIYuj5o76kP3aLizPK5B0TDo4Ziwq6yQVoa', 'admin', 'http://localhost:3000/images/vladislav-filippov-eOV2En5GM_g-unsplash.jpg1649924564249.jpg', 'Hello moi c\'est Mary :) ', '2022-04-04 09:22:48', '2022-04-14 08:22:44'),
(6, 'Dim', 'Gab', 'dim@mail.com', '$2b$10$d0naESe04NmbMoCzjUUp7unGtr3PwHiM8B01o.51Hp0r9SPx51jg.', 'user', 'http://localhost:3000/images/jeremiah-del-mar-6wEM5ZJWVDQ-unsplash.jpg1649924962224.jpg', '-', '2022-04-13 08:38:16', '2022-04-14 08:29:22'),
(8, 'test', 'test', 'test@mail.com', '$2b$10$LiO8HvMDfxk5SOadskslTuWyq0t.UnF04hIr0QgreiROJ9QwfkSme', 'user', 'http://localhost:3000/images/grenouille.jpg1649870367531.jpg', 'Hello moi c\'est Test, et vous ?', '2022-04-13 17:18:57', '2022-04-13 17:19:27');

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
