const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Note = sequelize.define("Note", {
  judul: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isi: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  timestamps: true,
  createdAt: 'tanggal_dibuat',
  updatedAt: false,
});

module.exports = Note;
