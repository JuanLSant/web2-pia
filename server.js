//Aquí conecto a la bd

import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345', 
    database: 'mundial_mexico',
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.error("Error al conectar a la BD:", err.message);
        return;
    }
    console.log("Conexión exitosa a MySQL");
});

app.get('/login', (req, res) => {
    db.query('SELECT 1', (err) => {
        if (err) return res.status(500).json({ status: "Sin conexión", error: err.message });
        return res.json({ status: "BD conectada correctamente" });
    });
});

app.post('/login', (req, res) => {
    //pruebas pruebas
    //console.log("Datos recibidos:", req.body);


    const { username, password } = req.body;
    const sql = "SELECT * FROM usuarios WHERE nombre = ? AND password = ?";
    db.query(sql, [username, password], (err, data) => {
        if(err) return res.status(500).json(err);
        if(data.length > 0) return res.json("Success");
        return res.status(401).json({ alerta: "Usuario o contraseña no coinciden" });
    })
});

app.listen(8081, () => { console.log("Servidor escuchando en el puerto 8081"); });