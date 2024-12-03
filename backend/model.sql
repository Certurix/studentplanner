CREATE DATABASE IF NOT EXISTS studentplanner;

USE studentplanner;

CREATE TABLE USER (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL
);
CREATE TABLE EVENTS (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50),
    priority INT,
    startdate DATETIME,
    enddate DATETIME,
    place VARCHAR(255),
    FOREIGN KEY (id_user) REFERENCES USER(id)
);