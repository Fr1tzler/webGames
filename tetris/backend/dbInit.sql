CREATE DATABASE SnakeRecords;
USE SnakeRecords;
CREATE TABLE records12x12 (
    gameId INT NOT NULL AUTO_INCREMENT, 
    playerName VARCHAR(50) NOT NULL, 
    score INT NOT NULL, 
    PRIMARY KEY(gameId)
);
CREATE TABLE records18x18 (
    gameId INT NOT NULL AUTO_INCREMENT, 
    playerName VARCHAR(50) NOT NULL, 
    score INT NOT NULL, 
    PRIMARY KEY(gameId)
); 
CREATE TABLE records24x24 (
    gameId INT NOT NULL AUTO_INCREMENT, 
    playerName VARCHAR(50) NOT NULL, 
    score INT NOT NULL, 
    PRIMARY KEY(gameId)
); 
CREATE TABLE records32x32 (
    gameId INT NOT NULL AUTO_INCREMENT, 
    playerName VARCHAR(50) NOT NULL, 
    score INT NOT NULL, 
    PRIMARY KEY(gameId)
); 