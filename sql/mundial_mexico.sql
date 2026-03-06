
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