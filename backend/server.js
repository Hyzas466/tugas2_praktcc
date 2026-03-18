const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');
const notesRoutes = require('./routes/notesRoutes');
require('./schema/Note'); // Import the schema for Sequelize sync

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost', 'http://127.0.0.1:5500', 'http://localhost:5000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json()); // Agar bisa menerima format JSON dari body request

// Routes
app.use('/api', notesRoutes);

// Sync Database dan Jalankan Server
sequelize.sync().then(() => {
    console.log("Database synced dengan Sequelize");
    app.listen(PORT, () => {
        console.log(`Server berjalan secara lokal di http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("Gagal melakukan sinkronisasi database:", err);
});