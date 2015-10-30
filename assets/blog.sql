/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50546
Source Host           : localhost:3306
Source Database       : tornblog

Target Server Type    : MYSQL
Target Server Version : 50546
File Encoding         : 65001

Date: 2015-10-26 17:15:16
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for torn_blog_info
-- ----------------------------
DROP TABLE IF EXISTS `torn_blog_info`;
CREATE TABLE `torn_blog_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text,
  `user` int(11) DEFAULT NULL,
  `view_count` int(11) DEFAULT '0',
  `createtime` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for torn_user_info
-- ----------------------------
DROP TABLE IF EXISTS `torn_user_info`;
CREATE TABLE `torn_user_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(30) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(30) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `is_super` smallint(1) NOT NULL DEFAULT '0',
  `createtime` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`,`username`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
