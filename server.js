const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');
const notesRoutes = require('./routes/notesRoutes');
require('./schema/Note'); // Import the schema for Sequelize sync

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({}));
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
