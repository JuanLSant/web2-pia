CREATE DATABASE mundial_mexico;
USE mundial_mexico;

CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    imagen_url VARCHAR(255) DEFAULT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE zonas (
    id_zona INT PRIMARY KEY AUTO_INCREMENT,
    nombre ENUM('Zona 1', 'Zona 2', 'Zona 3', 'Palcos') NOT NULL
);

CREATE TABLE areas (
    id_area INT PRIMARY KEY AUTO_INCREMENT,
    id_zona INT NOT NULL,
    nomenclatura VARCHAR(5) NOT NULL, -- A-1 hasta A-53, B-1 hasta B-53, etc.
    FOREIGN KEY (id_zona) REFERENCES zonas(id_zona),
    UNIQUE KEY unique_area (id_zona, nomenclatura)
);

CREATE TABLE asientos (
    id_asiento INT PRIMARY KEY AUTO_INCREMENT,
    nomenclatura VARCHAR(5) NOT NULL, -- 0-0 hasta 7-11
    UNIQUE KEY unique_nomenclatura (nomenclatura)
);

CREATE TABLE partidos (
    id_partido INT PRIMARY KEY AUTO_INCREMENT,
    estadio VARCHAR(100) NOT NULL DEFAULT 'Estadio BBVA',
    casa VARCHAR(100) NOT NULL,
    visitante VARCHAR(100) NOT NULL
);

INSERT INTO partidos (casa, visitante) VALUES
('Suecia', 'Túnez'),
('Túnez', 'Japón'),
('Sudáfrica', 'Corea del Sur');


CREATE TABLE asientos_partido (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_partido INT NOT NULL,
    id_zona INT NOT NULL,
    id_area INT NOT NULL,
    id_asiento INT NOT NULL,
    estado ENUM('activo', 'inactivo', 'comprado') NOT NULL DEFAULT 'activo',
    reservado_hasta DATETIME NULL DEFAULT NULL,
    FOREIGN KEY (id_partido) REFERENCES partidos(id_partido),
    FOREIGN KEY (id_zona) REFERENCES zonas(id_zona),
    FOREIGN KEY (id_area) REFERENCES areas(id_area),
    FOREIGN KEY (id_asiento) REFERENCES asientos(id_asiento),
    UNIQUE KEY unique_asiento_partido (id_partido, id_area, id_asiento)
);

CREATE TABLE boletos (
    id_boleto INT PRIMARY KEY AUTO_INCREMENT,
    id_asiento_partido INT NOT NULL,
    id_usuario INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    codigo_qr VARCHAR(255),
    FOREIGN KEY (id_asiento_partido) REFERENCES asientos_partido(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE recuperacion_codigos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    correo VARCHAR(100) NOT NULL,
    codigo VARCHAR(6) NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expira_en DATETIME NOT NULL,
    FOREIGN KEY (correo) REFERENCES usuarios(correo) ON DELETE CASCADE
);

