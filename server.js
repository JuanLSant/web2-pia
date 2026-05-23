import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'mundial_mexico',
    port: 3307
});

db.connect((err) => {
    if (err) {
        console.error("Error al conectar a la BD:", err.message);
        return;
    }
    console.log("Conexión exitosa a MySQL");
});

app.get('/test-db', (req, res) => {
    db.query('SELECT 1', (err) => {
        if (err) return res.status(500).json({ status: "Sin conexión", error: err });
        return res.json({ status: "BD conectada correctamente" });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT id_usuario, nombre, correo, imagen_url FROM usuarios WHERE nombre = ? AND password = ?";
    db.query(sql, [username, password], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length > 0) return res.json({ success: true, usuario: data[0] });
        return res.status(401).json({ alerta: "Usuario o contraseña no coinciden" });
    });
});

app.post('/registro', (req, res) => {
    const { nombre, email, password } = req.body;
    const sql = "INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)";
    db.query(sql, [nombre, email, password], (err, result) => {
        if(err) return res.status(500).json({ error: "Error al registrar usuario" });
        return res.json("Success");
    });
});

app.put('/usuario/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, password } = req.body;
    
    let sql;
    let params;
    if (password && password.trim() !== '') {
        sql = "UPDATE usuarios SET nombre = ?, password = ? WHERE id_usuario = ?";
        params = [nombre, password, id];
    } else {
        sql = "UPDATE usuarios SET nombre = ? WHERE id_usuario = ?";
        params = [nombre, id];
    }

    db.query(sql, params, (err) => {
        if (err) return res.status(500).json({ error: "Error al actualizar usuario" });
        return res.json({ success: true });
    });
});

app.put('/usuario/:id/imagen', (req, res) => {
    const { id } = req.params;
    const { imagen } = req.body;

    if (!imagen) {
        return res.status(400).json({ error: "No se proporcionó imagen" });
    }

    const matches = imagen.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    let ext = 'jpg';
    let dataBuffer;

    if (matches && matches.length === 3) {
        ext = matches[1];
        if (ext === 'jpeg') ext = 'jpg';
        dataBuffer = Buffer.from(matches[2], 'base64');
    } else {
        dataBuffer = Buffer.from(imagen, 'base64');
    }

    const dir = './uploads';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    const filename = `perfil_${id}_${Date.now()}.${ext}`;
    const filePath = path.join(dir, filename);
    const dbPath = `uploads/${filename}`;

    fs.writeFile(filePath, dataBuffer, (err) => {
        if (err) {
            console.error("Error al escribir archivo:", err);
            return res.status(500).json({ error: "Error al guardar el archivo" });
        }

        const sql = "UPDATE usuarios SET imagen_url = ? WHERE id_usuario = ?";
        db.query(sql, [dbPath, id], (err2) => {
            if (err2) {
                console.error("Error al actualizar BD:", err2);
                return res.status(500).json({ error: "Error al actualizar base de datos" });
            }
            return res.json({ success: true, imagen_url: dbPath });
        });
    });
});

app.get('/usuario-avatar/:username', (req, res) => {
    const { username } = req.params;
    const sql = "SELECT imagen_url FROM usuarios WHERE nombre = ?";
    db.query(sql, [username], (err, data) => {
        if (err) {
            console.error("Error al buscar avatar:", err);
            return res.status(500).json({ error: err });
        }
        if (data.length > 0) {
            return res.json({ success: true, imagen_url: data[0].imagen_url });
        }
        return res.json({ success: false });
    });
});

// ── Endpoints de Gestión de Asientos (Mundial FIFA 2026) ───────

const mapZonaName = (zonaKey) => {
    switch (zonaKey?.toLowerCase()) {
        case 'zona-1': return 'Zona 1';
        case 'zona-2': return 'Zona 2';
        case 'zona-3': return 'Zona 3';
        case 'palcos': return 'Palcos';
        default: return 'Zona 1';
    }
};

const initializeSeats = (id_partido, id_zona, id_area, callback) => {
    const nomenclaturas = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 12; j++) {
            nomenclaturas.push([`${i}-${j}`]);
        }
    }
    
    const sqlAsientos = "INSERT IGNORE INTO asientos (nomenclatura) VALUES ?";
    db.query(sqlAsientos, [nomenclaturas], (err) => {
        if (err) {
            console.error("Error al poblar tabla asientos:", err);
            return callback(err);
        }
        
        const sqlAsientosPartido = `
            INSERT IGNORE INTO asientos_partido (id_partido, id_zona, id_area, id_asiento, estado, reservado_hasta)
            SELECT ?, ?, ?, id_asiento, 'activo', NULL FROM asientos
        `;
        db.query(sqlAsientosPartido, [id_partido, id_zona, id_area], (err2) => {
            if (err2) console.error("Error al inicializar asientos_partido:", err2);
            callback();
        });
    });
};

app.get('/partido-asientos', (req, res) => {
    const { id_partido, zona, area } = req.query;
    if (!id_partido || !zona || !area) {
        return res.status(400).json({ error: "Faltan parámetros requeridos" });
    }

    const nombreZona = mapZonaName(zona);
    
    db.query("SELECT id_zona FROM zonas WHERE nombre = ?", [nombreZona], (err, zonasData) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const runQuery = (id_zona_val) => {
            db.query("SELECT id_area FROM areas WHERE id_zona = ? AND nomenclatura = ?", [id_zona_val, area], (err, areasData) => {
                if (err) return res.status(500).json({ error: err.message });
                
                const fetchSeatsData = (id_area_val) => {
                    // Limpiar reservas expiradas
                    const sqlLimpiar = `
                        UPDATE asientos_partido 
                        SET estado = 'activo', reservado_hasta = NULL 
                        WHERE id_partido = ? 
                          AND estado = 'inactivo' 
                          AND reservado_hasta IS NOT NULL 
                          AND reservado_hasta < NOW()
                    `;
                    db.query(sqlLimpiar, [id_partido], (errLimpiar) => {
                        if (errLimpiar) console.error("Error al limpiar reservas expiradas:", errLimpiar);
                        
                        const queryAsientos = `
                            SELECT a.nomenclatura, ap.estado, ap.reservado_hasta 
                            FROM asientos_partido ap
                            JOIN asientos a ON ap.id_asiento = a.id_asiento
                            WHERE ap.id_partido = ? AND ap.id_zona = ? AND ap.id_area = ?
                        `;
                        db.query(queryAsientos, [id_partido, id_zona_val, id_area_val], (errFetch, asientosData) => {
                            if (errFetch) return res.status(500).json({ error: errFetch.message });
                            
                            if (asientosData.length === 96) {
                                return res.json({ success: true, asientos: asientosData });
                            }
                            
                            // Si no están inicializados los 96 asientos, los creamos
                            initializeSeats(id_partido, id_zona_val, id_area_val, (errInit) => {
                                if (errInit) return res.status(500).json({ error: "No se pudo inicializar los asientos" });
                                
                                db.query(queryAsientos, [id_partido, id_zona_val, id_area_val], (errFetch2, nuevosAsientosData) => {
                                    if (errFetch2) return res.status(500).json({ error: errFetch2.message });
                                    return res.json({ success: true, asientos: nuevosAsientosData });
                                });
                            });
                        });
                    });
                };

                if (areasData.length > 0) {
                    fetchSeatsData(areasData[0].id_area);
                } else {
                    db.query("INSERT INTO areas (id_zona, nomenclatura) VALUES (?, ?)", [id_zona_val, area], (errInsert, resultInsert) => {
                        if (errInsert) return res.status(500).json({ error: errInsert.message });
                        fetchSeatsData(resultInsert.insertId);
                    });
                }
            });
        };

        if (zonasData.length > 0) {
            runQuery(zonasData[0].id_zona);
        } else {
            db.query("INSERT INTO zonas (nombre) VALUES (?)", [nombreZona], (errInsertZ, resultInsertZ) => {
                if (errInsertZ) return res.status(500).json({ error: errInsertZ.message });
                runQuery(resultInsertZ.insertId);
            });
        }
    });
});

app.post('/reservar-asientos', (req, res) => {
    const { id_partido, zona, area, nomenclaturas } = req.body;
    if (!id_partido || !zona || !area || !nomenclaturas || !nomenclaturas.length) {
        return res.status(400).json({ error: "Faltan parámetros requeridos" });
    }
    
    const nombreZona = mapZonaName(zona);
    
    const sqlGetIDs = `
        SELECT z.id_zona, a.id_area 
        FROM zonas z
        JOIN areas a ON z.id_zona = a.id_zona
        WHERE z.nombre = ? AND a.nomenclatura = ?
    `;
    db.query(sqlGetIDs, [nombreZona, area], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ error: "Zona o Área no encontrada" });
        
        const { id_zona, id_area } = result[0];
        
        // Reservar los asientos que estén actualmente en estado 'activo'
        const sqlUpdate = `
            UPDATE asientos_partido ap
            JOIN asientos a ON ap.id_asiento = a.id_asiento
            SET ap.estado = 'inactivo', ap.reservado_hasta = DATE_ADD(NOW(), INTERVAL 5 MINUTE)
            WHERE ap.id_partido = ? 
              AND ap.id_zona = ? 
              AND ap.id_area = ? 
              AND a.nomenclatura IN (?)
              AND ap.estado = 'activo'
        `;
        db.query(sqlUpdate, [id_partido, id_zona, id_area, nomenclaturas], (errUpdate, resultUpdate) => {
            if (errUpdate) return res.status(500).json({ error: errUpdate.message });
            
            // Si la cantidad de filas afectadas es menor, algún asiento ya no estaba 'activo'
            if (resultUpdate.affectedRows < nomenclaturas.length) {
                return res.status(409).json({ 
                    success: false, 
                    error: "Uno o más asientos seleccionados ya no están disponibles. Por favor, vuelve a intentar." 
                });
            }
            
            return res.json({ success: true });
        });
    });
});

app.post('/liberar-asientos', (req, res) => {
    const { id_partido, zona, area, nomenclaturas } = req.body;
    if (!id_partido || !zona || !area || !nomenclaturas || !nomenclaturas.length) {
        return res.status(400).json({ error: "Faltan parámetros requeridos" });
    }
    
    const nombreZona = mapZonaName(zona);
    
    const sqlGetIDs = `
        SELECT z.id_zona, a.id_area 
        FROM zonas z
        JOIN areas a ON z.id_zona = a.id_zona
        WHERE z.nombre = ? AND a.nomenclatura = ?
    `;
    db.query(sqlGetIDs, [nombreZona, area], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ error: "Zona o Área no encontrada" });
        
        const { id_zona, id_area } = result[0];
        
        const sqlUpdate = `
            UPDATE asientos_partido ap
            JOIN asientos a ON ap.id_asiento = a.id_asiento
            SET ap.estado = 'activo', ap.reservado_hasta = NULL
            WHERE ap.id_partido = ? 
              AND ap.id_zona = ? 
              AND ap.id_area = ? 
              AND a.nomenclatura IN (?)
              AND ap.estado = 'inactivo'
        `;
        db.query(sqlUpdate, [id_partido, id_zona, id_area, nomenclaturas], (errUpdate) => {
            if (errUpdate) return res.status(500).json({ error: errUpdate.message });
            return res.json({ success: true });
        });
    });
});

app.post('/comprar-asientos', (req, res) => {
    //console.log("CONTENIDO COMPLETO DE REQ.BODY:", JSON.stringify(req.body, null, 2));
    const { id_partido, zona, area, nomenclaturas, id_usuario, total, correo } = req.body;
    
    if (!id_partido || !zona || !area || !nomenclaturas || !nomenclaturas.length || !id_usuario || total === undefined) {
        return res.status(400).json({ error: "Faltan parámetros requeridos" });
    }
    
    const nombreZona = mapZonaName(zona);
    const precioUnitario = parseFloat(total) / nomenclaturas.length;
    
    const sqlGetIDs = `
        SELECT z.id_zona, a.id_area 
        FROM zonas z
        JOIN areas a ON z.id_zona = a.id_zona
        WHERE z.nombre = ? AND a.nomenclatura = ?
    `;
    
    db.query(sqlGetIDs, [nombreZona, area], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ error: "Zona o Área no encontrada" });
        
        const { id_zona, id_area } = result[0];
        
        db.beginTransaction((errTx) => {
            if (errTx) return res.status(500).json({ error: errTx.message });
            
            const sqlSelectAP = `
                SELECT ap.id, a.nomenclatura 
                FROM asientos_partido ap
                JOIN asientos a ON ap.id_asiento = a.id_asiento
                WHERE ap.id_partido = ? 
                  AND ap.id_zona = ? 
                  AND ap.id_area = ? 
                  AND a.nomenclatura IN (?)
            `;
            
            db.query(sqlSelectAP, [id_partido, id_zona, id_area, nomenclaturas], (errSelect, apRows) => {
                if (errSelect) return db.rollback(() => res.status(500).json({ error: errSelect.message }));
                
                if (apRows.length < nomenclaturas.length) {
                    return db.rollback(() => res.status(404).json({ error: "Algunos asientos no están registrados" }));
                }
                
                const apIds = apRows.map(row => row.id);
                const sqlUpdateAP = `UPDATE asientos_partido SET estado = 'comprado', reservado_hasta = NULL WHERE id IN (?)`;
                
                db.query(sqlUpdateAP, [apIds], (errUpdate) => {
                    if (errUpdate) return db.rollback(() => res.status(500).json({ error: errUpdate.message }));
                    
                    const boletoInserts = apIds.map(apId => {
                        const qrCode = `QR_${id_partido}_${id_zona}_${id_area}_${apId}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
                        return [apId, id_usuario, precioUnitario, qrCode];
                    });
                    
                    const sqlInsertBoletos = `INSERT INTO boletos (id_asiento_partido, id_usuario, total, codigo_qr) VALUES ?`;
                    
                    db.query(sqlInsertBoletos, [boletoInserts], (errBoletos) => {
                        if (errBoletos) return db.rollback(() => res.status(500).json({ error: errBoletos.message }));
                        
                        db.commit((errCommit) => {
                            if (errCommit) return db.rollback(() => res.status(500).json({ error: errCommit.message }));


                            //console.log("DEBUG: Valor del email que llega al servidor:", correo);
                            const mailOptions = {
                                from: 'webpagina222@gmail.com',
                                to: correo, 
                                subject: 'Confirmación de Compra - Mundial 2026',
                                text: `¡Felicidades! Tu compra se ha realizado con éxito.`
                            };

                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {
                                    console.log("Error al enviar correo:", error);
                                    return res.json({ success: true, message: "Compra realizada, pero falló el envío del correo" });
                                } else {
                                    console.log("Correo enviado: " + info.response);
                                    return res.json({ success: true });
                                }
                            });
                        });
                    });
                });
            });
        });
    });
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'webpagina222@gmail.com',
        pass: 'efhfekarspqbpxrq'
    }
});

app.listen(8081, () => {
    console.log("Servidor escuchando en el puerto 8081");
});

