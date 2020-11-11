-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           10.4.14-MariaDB - mariadb.org binary distribution
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Copiando estrutura do banco de dados para projeto
CREATE DATABASE IF NOT EXISTS `projeto` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `projeto`;

-- Copiando estrutura para tabela projeto.pessoas
CREATE TABLE IF NOT EXISTS `pessoas` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=utf8mb4;

-- Copiando dados para a tabela projeto.pessoas: ~2 rows (aproximadamente)
/*!40000 ALTER TABLE `pessoas` DISABLE KEYS */;
INSERT INTO `pessoas` (`id`, `nome`) VALUES
	(92, 'Jose '),
	(93, 'Andressa ');
/*!40000 ALTER TABLE `pessoas` ENABLE KEYS */;

-- Copiando estrutura para tabela projeto.pessoas_contato
CREATE TABLE IF NOT EXISTS `pessoas_contato` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `id_pessoa` int(5) NOT NULL,
  `nome_contato` varchar(20) NOT NULL DEFAULT '',
  `contato` varchar(85) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `FK_pessoas_contato_pessoas` (`id_pessoa`),
  CONSTRAINT `FK_pessoas_contato_pessoas` FOREIGN KEY (`id_pessoa`) REFERENCES `pessoas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4;

-- Copiando dados para a tabela projeto.pessoas_contato: ~6 rows (aproximadamente)
/*!40000 ALTER TABLE `pessoas_contato` DISABLE KEYS */;
INSERT INTO `pessoas_contato` (`id`, `id_pessoa`, `nome_contato`, `contato`) VALUES
	(40, 92, 'tel', '3598121'),
	(41, 92, 'Email', 'jose@jose'),
	(42, 92, 'ZAP ', '359845154'),
	(43, 93, 'Tel', '35987941'),
	(44, 93, 'tel2', '369531254'),
	(45, 93, '', '');
/*!40000 ALTER TABLE `pessoas_contato` ENABLE KEYS */;

-- Copiando estrutura para trigger projeto.pessoas_before_delete
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `pessoas_before_delete` BEFORE DELETE ON `pessoas` FOR EACH ROW BEGIN
	DELETE FROM pessoas_contato WHERE pessoas_contato.id_pessoa = OLD.id;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
