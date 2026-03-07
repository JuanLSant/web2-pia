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