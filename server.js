//Aquí conecto a la bd

import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'mundial_mexico',
    port: 3307
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM usuarios WHERE nombre = ? AND password = ?";
    db.query(sql, [username, password], (err, data) => {
        if(err) return res.json(err);
        if(data.length > 0) return res.json("Success");
        return res.status(401).json({ alerta: "Usuario o contraseña no coinciden" });
    })
});

app.listen(8081, () => { console.log("Servidor escuchando en el puerto 8081"); });