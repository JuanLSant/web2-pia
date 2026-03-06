//Aquí conecto a la bd

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'mundial_mexico' 
});

app.post('/login', (req, res) => {
    const { correo, password } = req.body;
    const sql = "SELECT * FROM usuarios WHERE correo = ? AND password = ?";
    db.query(sql, [correo, password], (err, data) => {
        if(err) return res.json(err);
        if(data.length > 0) return res.json("Success");
        return res.status(401).json({ alerta: "Usuario o contraseña no coinciden" });
    })
});

app.listen(8081, () => { console.log("Servidor escuchando en el puerto 8081"); });