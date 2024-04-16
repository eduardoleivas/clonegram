CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

CREATE TABLE `mydb`.`user` (
  `id_user` INT NOT NULL,
  `username` VARCHAR(30) NOT NULL,
  `password` VARCHAR(30) NOT NULL,
  `email` VARCHAR(60) NOT NULL,
  `bio` VARCHAR(150),
  `id_img` VARCHAR(520),
  `url_img` VARCHAR(520),
  PRIMARY KEY (`id_user`));

CREATE TABLE `mydb`.`post` (
  `id_post` INT NOT NULL,
  `id_creator` INT NOT NULL,
  `imgUrl` VARCHAR(520) NOT NULL,
  `igmId` VARCHAR(520) NOT NULL,
  `date` DATETIME NOT NULL,
  `caption` VARCHAR(280) NULL,
  `tag` VARCHAR(160) NULL,
  `location` VARCHAR(160) NULL,
  PRIMARY KEY (`id_post`, `id_creator`),
  INDEX `caption` (`caption` ASC) VISIBLE,
  CONSTRAINT `fk_post_user` FOREIGN KEY (`id_creator`) REFERENCES `mydb`.`user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE);

CREATE TABLE `mydb`.`like` (
  `id_creator` INT NOT NULL,
  `id_post` INT NOT NULL,
  `date` DATETIME NOT NULL,
  PRIMARY KEY (`id_creator`, `id_post`),
  CONSTRAINT `fk_like_user` FOREIGN KEY (`id_creator`) REFERENCES `mydb`.`user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_like_post` FOREIGN KEY (`id_post`) REFERENCES `mydb`.`post` (`id_post`) ON DELETE CASCADE ON UPDATE CASCADE);

CREATE TABLE `mydb`.`comment` (
  `id_creator` INT NOT NULL,
  `id_post` INT NOT NULL,
  `date` DATETIME NOT NULL,
  `text` VARCHAR(280) NOT NULL,
  PRIMARY KEY (`id_creator`, `id_post`),
  CONSTRAINT `fk_comment_user` FOREIGN KEY (`id_creator`) REFERENCES `mydb`.`user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_comment_post` FOREIGN KEY (`id_post`) REFERENCES `mydb`.`post` (`id_post`) ON DELETE CASCADE ON UPDATE CASCADE);

CREATE TABLE `mydb`.`save` (
  `id_post` INT NOT NULL,
  `user_id_user` INT NOT NULL,
  PRIMARY KEY (`id_post`, `user_id_user`),
  CONSTRAINT `fk_save_post` FOREIGN KEY (`id_post`) REFERENCES `mydb`.`post` (`id_post`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_save_user` FOREIGN KEY (`user_id_user`) REFERENCES `mydb`.`user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE);
