CREATE DATABASE SnakeRecords;
USE SnakeRecords;
CREATE TABLE recordList (
    gameId INT NOT NULL AUTO_INCREMENT, 
    playerName VARCHAR(50) NOT NULL, 
    score INT NOT NULL, 
    PRIMARY KEY(gameId)
); 