CREATE DATABASE IF NOT EXISTS studentplanner;
CREATE USER 'studentplanner_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON studentplanner.* TO 'studentplanner_user'@'localhost';

USE studentplanner;

CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) ,
    school VARCHAR(50),
    class VARCHAR(50)
);
CREATE TABLE events (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50),
    priority INT,
    startdate DATETIME,
    enddate DATETIME,
    place VARCHAR(255),
    FOREIGN KEY (id_user) REFERENCES user(id)
);