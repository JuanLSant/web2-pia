--las tablas se cambiaron (renombraron) a ingles:

SET FOREIGN_KEY_CHECKS = 0;

RENAME TABLE usuarios TO users;
ALTER TABLE users 
    CHANGE COLUMN id_usuario id_user INT NOT NULL AUTO_INCREMENT,
    CHANGE COLUMN nombre username VARCHAR(100) NOT NULL,
    CHANGE COLUMN correo email VARCHAR(100) NOT NULL,
    CHANGE COLUMN fecha_registro created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;


RENAME TABLE selecciones TO teams;
ALTER TABLE teams 
    CHANGE COLUMN id_seleccion id_team INT NOT NULL AUTO_INCREMENT,
    CHANGE COLUMN nombre team_name VARCHAR(50),
    CHANGE COLUMN grupo group_letter CHAR(1),
    CHANGE COLUMN bandera_url flag_url VARCHAR(255);


RENAME TABLE estadios TO stadiums;
ALTER TABLE stadiums 
    CHANGE COLUMN id_estadio id_stadium INT NOT NULL AUTO_INCREMENT,
    CHANGE COLUMN nombre stadium_name VARCHAR(100),
    CHANGE COLUMN ciudad city VARCHAR(50),
    CHANGE COLUMN capacidad capacity INT;


RENAME TABLE zonas TO zones;
ALTER TABLE zones 
    CHANGE COLUMN id_zona id_zone INT NOT NULL AUTO_INCREMENT,
    CHANGE COLUMN nombre_zona zone_name VARCHAR(50),
    CHANGE COLUMN id_estadio id_stadium INT;


RENAME TABLE partidos TO matches;
ALTER TABLE matches 
    CHANGE COLUMN id_partido id_match INT NOT NULL AUTO_INCREMENT,
    CHANGE COLUMN id_local id_home_team INT,
    CHANGE COLUMN id_visitante id_away_team INT,
    CHANGE COLUMN id_estadio id_stadium INT,
    CHANGE COLUMN fecha_hora match_date DATETIME;


RENAME TABLE metodos_pago TO payment_methods;
ALTER TABLE payment_methods 
    CHANGE COLUMN id_metodo id_method INT NOT NULL AUTO_INCREMENT,
    CHANGE COLUMN tipo method_type VARCHAR(50);


RENAME TABLE ventas TO sales;
ALTER TABLE sales 
    CHANGE COLUMN id_venta id_sale INT NOT NULL AUTO_INCREMENT,
    CHANGE COLUMN id_usuario id_user INT,
    CHANGE COLUMN id_metodo id_method INT,
    CHANGE COLUMN fecha_venta sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;


RENAME TABLE boletos TO tickets;
ALTER TABLE tickets 
    CHANGE COLUMN id_boleto id_ticket INT NOT NULL AUTO_INCREMENT,
    CHANGE COLUMN id_venta id_sale INT,
    CHANGE COLUMN id_partido id_match INT,
    CHANGE COLUMN asiento_nomenclatura seat_number VARCHAR(10),
    CHANGE COLUMN codigo_qr qr_code VARCHAR(255);


RENAME TABLE precios_evento TO event_prices;

ALTER TABLE event_prices 
    CHANGE COLUMN id_precio id_price INT NOT NULL AUTO_INCREMENT,
    CHANGE COLUMN id_partido id_match INT,
    CHANGE COLUMN id_zona id_zone INT,
    CHANGE COLUMN precio price DECIMAL(10,2); 


RENAME TABLE check_in_acceso TO access_logs;
ALTER TABLE access_logs 
    CHANGE COLUMN id_acceso id_access INT NOT NULL AUTO_INCREMENT,
    CHANGE COLUMN id_boleto id_ticket INT,
    CHANGE COLUMN fecha_entrada entry_time DATETIME;
    
SET FOREIGN_KEY_CHECKS = 1;

--SCRIPT ESPAÑOL


CREATE DATABASE mundial_mexico;
USE mundial_mexico;

CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE selecciones (
    id_seleccion INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50),
    grupo CHAR(1),
    bandera_url VARCHAR(255)
);

CREATE TABLE estadios (
    id_estadio INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    ciudad VARCHAR(50),
    capacidad INT
);

CREATE TABLE partidos (
    id_partido INT PRIMARY KEY AUTO_INCREMENT,
    id_local INT,
    id_visitante INT,
    id_estadio INT,
    fecha_hora DATETIME,
    FOREIGN KEY (id_local) REFERENCES selecciones(id_seleccion),
    FOREIGN KEY (id_visitante) REFERENCES selecciones(id_seleccion),
    FOREIGN KEY (id_estadio) REFERENCES estadios(id_estadio)
);

CREATE TABLE metodos_pago (
    id_metodo INT PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(50) -- Ej: 'Tarjeta de Crédito'
);

CREATE TABLE ventas (
    id_venta INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT,
    id_metodo INT,
    total DECIMAL(10,2),
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_metodo) REFERENCES metodos_pago(id_metodo)
);

CREATE TABLE boletos (
    id_boleto INT PRIMARY KEY AUTO_INCREMENT,
    id_venta INT,
    id_partido INT,
    asiento_nomenclatura VARCHAR(10), -- Ej: 'H12'
    codigo_qr VARCHAR(255),
    FOREIGN KEY (id_venta) REFERENCES ventas(id_venta),
    FOREIGN KEY (id_partido) REFERENCES partidos(id_partido)
);

CREATE TABLE zonas (
    id_zona INT PRIMARY KEY AUTO_INCREMENT,
    nombre_zona VARCHAR(50), -- Ej: 'Zona T7'
    id_estadio INT,
    FOREIGN KEY (id_estadio) REFERENCES estadios(id_estadio)
);

CREATE TABLE precios_evento (
    id_precio INT PRIMARY KEY AUTO_INCREMENT,
    id_partido INT,
    id_zona INT,
    precio DECIMAL(10,2),
    FOREIGN KEY (id_partido) REFERENCES partidos(id_partido),
    FOREIGN KEY (id_zona) REFERENCES zonas(id_zona)
);

CREATE TABLE check_in_acceso (
    id_acceso INT PRIMARY KEY AUTO_INCREMENT,
    id_boleto INT,
    fecha_entrada DATETIME,
    FOREIGN KEY (id_boleto) REFERENCES boletos(id_boleto)
);


-- 1.  mtodo de pago (ID Apple Pay)
INSERT INTO payment_methods (id_method, method_type) 
VALUES (1, 'Apple Pay')
ON DUPLICATE KEY UPDATE method_type='Apple Pay';

-- 2. Estadios 
INSERT INTO stadiums (stadium_name, city, capacity) 
VALUES ('Estadio Azteca', 'CDMX', 87000);

-- 3. Insertar Equipos 
INSERT INTO teams (team_name, group_letter) 
VALUES ('México', 'A'), ('Estados Unidos', 'A');

-- 4.Partido 
INSERT INTO matches (id_match, id_home_team, id_away_team, id_stadium, match_date) 
VALUES (1, 1, 2, 1, '2026-06-11 20:00:00');

-- 5. crear una zona y un porecio 
INSERT INTO zones (id_zone, zone_name, id_stadium) VALUES (1, 'General North', 1);
INSERT INTO event_prices (id_match, id_zone, price) VALUES (1, 1, 250.00);