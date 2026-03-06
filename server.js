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
    const sql = "SELECT * FROM usuarios WHERE nombre = ? AND password = ?";
    db.query(sql, [username, password], (err, data) => {
        if(err) return res.status(500).json(err);
        if(data.length > 0) return res.json("Success");
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

app.listen(8081, () => {
    console.log("Servidor escuchando en el puerto 8081");
});