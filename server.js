import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

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
        if (err) return res.status(500).json({ error: "Error al registrar usuario" });
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

app.listen(8081, () => {
    console.log("Servidor escuchando en el puerto 8081");
});