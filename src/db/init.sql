use income_tax_generator;

/* User Table */

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(255) NOT NULL
);

INSERT INTO users (name, email, password)
VALUES ('Admin', 'admin@example.com', 'admin123');

/* CESS Table */

CREATE TABLE IF NOT EXISTS cess (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    amount BIGINT NOT NULL,
    percentage INT NOT NULL
);

/* Surcharge Table */

CREATE TABLE IF NOT EXISTS surcharge (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    amount BIGINT NOT NULL,
    percentage INT NOT NULL
);

/* New Regime Income Tax Table */

CREATE TABLE IF NOT EXISTS income_tax (
    id INT AUTO_INCREMENT PRIMARY KEY,
    amount BIGINT NOT NULL,
    percentage INT NOT NULL
);

INSERT INTO income_tax (amount, percentage)
SELECT 400000, 0
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM income_tax
);

/* Old Income Tax Table */

CREATE TABLE IF NOT EXISTS old_income_tax (
    id INT AUTO_INCREMENT PRIMARY KEY,
    amount BIGINT NOT NULL,
    percentage INT NOT NULL
);

INSERT INTO old_income_tax (amount, percentage)
SELECT 250000, 0
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM old_income_tax
);

/* Rebate Table */

CREATE TABLE IF NOT EXISTS rebate (
    id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
    amount BIGINT NOT NULL,
    upto BIGINT NOT NULL
);

/* Old Rebate Table */

CREATE TABLE IF NOT EXISTS old_rebate (
    id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
    amount BIGINT NOT NULL,
    upto BIGINT NOT NULL
);

/* Latest Update */

CREATE TABLE IF NOT EXISTS latest_updates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(100) NOT NULL,
    description VARCHAR(3000) NOT NULL
);