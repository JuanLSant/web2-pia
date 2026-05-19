import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { generarLink } from './walletService.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'webpagina222@gmail.com', 
        pass: 'efhfekarspqbpxrq'           
    }
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    const sql = "SELECT id_usuario, nombre, correo FROM usuarios WHERE nombre = ? AND password = ?";
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
    const sql = "UPDATE usuarios SET nombre = ?, password = ? WHERE id_usuario = ?";
    db.query(sql, [nombre, password, id], (err) => {
        if (err) return res.status(500).json({ error: "Error al actualizar usuario" });
        return res.json({ success: true });
    });
});

app.listen(8081, () => {
    console.log("Servidor escuchando en el puerto 8081");
});

app.post('/api/crear-boleto-wallet', async (req, res) => {
    const { correo, id_metodo, id_partido, asientos, id_zona } = req.body; 

    if (!correo || !asientos || asientos.length === 0 || !id_zona || !id_partido) {
        return res.status(400).json({ error: 'Faltan datos obligatorios (correo, asientos, zona o partido)' });
    }
    
    const queryPrecio = 'SELECT precio FROM zonas WHERE id_zona = ?';
    db.query(queryPrecio, [id_zona], (err, zonaResult) => {
        if (err || zonaResult.length === 0) {
            return res.status(400).json({ error: 'La zona seleccionada no existe en la base de datos' });
        }
        
        const precioZona = zonaResult[0].precio;
        const totalCalculated = asientos.length * precioZona;

        const queryUsuario = 'SELECT id_usuario FROM usuarios WHERE correo = ?';
        db.query(queryUsuario, [correo], (err, userResult) => {
            if (err || userResult.length === 0) {
                return res.status(400).json({ error: 'Usuario no encontrado' });
            }
            const id_usuario = userResult[0].id_usuario;

            const queryVenta = 'INSERT INTO ventas (id_usuario, id_metodo, total) VALUES (?, ?, ?)';
            db.query(queryVenta, [id_usuario, id_metodo || 1, totalCalculated], (err, ventaResult) => {
                if (err) {
                    console.error("Error al insertar en ventas:", err);
                    return res.status(500).json({ error: 'Error al registrar la venta' });
                }
                const id_venta = ventaResult.insertId; 

                const valoresBoletos = asientos.map(asiento => [
                    id_venta,
                    id_partido, 
                    id_zona,         
                    asiento,
                    `QR-${id_venta}-${asiento}` 
                ]);

                const queryBoletos = 'INSERT INTO boletos (id_venta, id_partido, id_zona, asiento_nomenclatura, codigo_qr ) VALUES ?';
                db.query(queryBoletos, [valoresBoletos], async(err) => {
                    if (err) {
                        console.error("Error al insertar en boletos:", err);
                        return res.status(500).json({ error: 'Error al registrar los boletos' });
                    }
                    
                    try {
                        const linkWallet = await generarLink(correo); 
                        const mailOptions = {
                            from: '"Ticketmaster" <webpagina222@gmail.com>',
                            to: correo,
                            subject: '¡Confirmación de Compra - Tus Boletos están Listos!',
                            html: `
                                <div style="background-color: #1a1a1a; color: white; padding: 30px; font-family: Arial, sans-serif; border-radius: 12px; max-width: 500px; margin: 0 auto; border: 1px solid #ff9800;">
                                    <h2 style="color: #ff9800; text-align: center;">¡Gracias por tu compra!</h2>
                                    <p>Tus boletos están listos para añadir a tu celular:</p>
                                    <div style="text-align: center; margin: 20px 0;">
                                        <a href="${linkWallet}">
                                            <img src="https://developers.google.com/wallet/images/add-to-google-wallet-button.png" alt="Añadir a Google Wallet" style="width: 200px;">
                                        </a>
                                    </div>
                                    <p><strong>Asientos:</strong> ${asientos.join(', ')}</p>
                                </div>
                            `
                        };

                        await transporter.sendMail(mailOptions);
                        console.log("Correo con pase de Wallet enviado a: " + correo);
                        
                        return res.status(200).json({ success: true, message: "¡Compra procesada con éxito!" });

                    } catch (error) {
                        console.error("Error al generar el pase o enviar correo:", error);
                        return res.status(200).json({ success: true, message: "¡Compra procesada, pero ocurrió un error al enviar el pase a Wallet!" });
                    }
                }); 
            }); 
        }); 
    }); 
});


app.get('/api/zonas/:id', (req, res) => {
    const idZona = req.params.id;
    const query = "SELECT id_zona, nombre_zona, precio FROM zonas WHERE id_zona = ?";
    
    db.query(query, [idZona], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        if (rows.length === 0) return res.status(404).json({ message: "Zona no encontrada" });
        
        res.json(rows[0]);
    });
});

app.get('/api/mis-boletos/:email', (req, res) => {
    const { email } = req.params;
    
    const query = `
        SELECT b.asiento_nomenclatura, v.fecha_venta, v.total
        FROM boletos b
        INNER JOIN ventas v ON b.id_venta = v.id_venta
        INNER JOIN usuarios u ON v.id_usuario = u.id_usuario
        WHERE u.email = ?
        ORDER BY v.fecha_venta DESC
    `;

    db.query(query, [email], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al consultar boletos' });
        }
        res.json(results);
    });
});

app.get('/api/partidos', (req, res) => {
    const query = `
        SELECT 
            p.id_partido,
            p.fecha_hora AS fecha,
            loc.nombre AS equipo_local,
            vis.nombre AS equipo_visitante
        FROM partidos p
        INNER JOIN selecciones loc ON p.id_local = loc.id_seleccion
        INNER JOIN selecciones vis ON p.id_visitante = vis.id_seleccion
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error al obtener partidos:", err);
            return res.status(500).json({ error: 'Error al consultar partidos' });
        }
        res.json(results);
    });
});