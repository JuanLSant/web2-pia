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
    console.log("Datos recibidos del cliente:", req.body);
    const { username, password } = req.body;

    //console.log("Intentando login con:", username, password);
    
    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    
    db.query(sql, [username, password], (err, data) => {
        console.log("Resultado de la base de datos:", data);
        if (err) return res.status(500).json(err);
        
        if (data.length > 0) {
            return res.json(data[0]);
        } else {
            return res.status(401).json({ alerta: "Usuario o contraseña no coinciden" });
        }
    });
});

app.post('/register', (req, res) => { 
    const { username, email, password } = req.body;
    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.query(sql, [username, email, password], (err, result) => {
        if(err) {
            console.log(err); 
            return res.status(500).json({ error: "Error al registrar usuario" });
        }
        return res.json("Success");
    });
});

app.put('/users/:id', (req, res) => { 
    const { id } = req.params;
    const { username, password } = req.body; 
    const sql = "UPDATE users SET username = ?, password = ? WHERE id_user = ?";
    
    db.query(sql, [username, password, id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Error al actualizar usuario" });
        }
        return res.json({ success: true });
    });
});

app.listen(8081, () => {
    console.log("Servidor escuchando en el puerto 8081");
});

app.post('/simulate-wallet', (req, res) => {
    const { id_user, total, id_match, seat_number } = req.body;
    const sqlSale = "INSERT INTO sales (id_user, id_method, total) VALUES (?, 1, ?)";
    
    db.query(sqlSale, [id_user, total], (err, saleResult) => {
        if (err) return res.status(500).json(err);
        
        const id_sale = saleResult.insertId;
        const qr_mock = `TICKET-${id_match}-${id_sale}-${seat_number}`;

        const sqlTicket = "INSERT INTO tickets (id_sale, id_match, seat_number, qr_code) VALUES (?, ?, ?, ?)";
        
        db.query(sqlTicket, [id_sale, id_match, seat_number, qr_mock], (err) => {
            if (err) return res.status(500).json(err);
            res.json({ success: true, message: "Boleto generado en la Wallet" });
        });
    });
});