CREATE DATABASE IF NOT EXISTS studentplanner;

USE studentplanner;

CREATE TABLE USER (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) NULLABLE,
    school VARCHAR(50) NULLABLE,
    class VARCHAR(50) NULLABLE,
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