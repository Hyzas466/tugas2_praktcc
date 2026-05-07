const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');
const notesRoutes = require('./routes/notesRoutes');
require('./schema/Note');

const app = express();
// Pastikan mengambil PORT dari environment, default ke 5000 jika di lokal ingin sama dengan Cloud Run
const PORT = process.env.PORT || 5000; 

// Middleware
app.use(cors({}));
app.use(express.json());

// Routes
app.use('/api', notesRoutes);

// Health Check (Penting untuk Cloud Run)
app.get('/', (req, res) => {
    res.status(200).send('Server is alive!');
});

// Jalankan Server DULU agar Cloud Run tidak timeout
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server berjalan di port ${PORT}`);
    
    // Baru jalankan sinkronisasi database di latar belakang
    sequelize.sync()
        .then(() => console.log("Database synced"))
        .catch(err => console.error("Database sync failed:", err));
});
