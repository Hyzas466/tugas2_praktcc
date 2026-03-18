const noteModel = require("../models/noteModels");

// 1. Lihat daftar catatan
const getNotes = async (req, res) => {
    try {
        const allNotes = await noteModel.findAll();
        res.status(200).json({ status: 'success', data: allNotes });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// 2. Tambah catatan
const addNote = async (req, res) => {
    const { judul, isi } = req.body;
    try {
        const newNote = await noteModel.create({ judul, isi });
        res.status(201).json({ status: 'success', message: 'Catatan berhasil ditambahkan', id: newNote.id });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// 3. Edit catatan
const updateNote = async (req, res) => {
    const { id } = req.params;
    const { judul, isi } = req.body;
    try {
        const note = await noteModel.findById(id);

        if (!note) {
            return res.status(404).json({ status: 'error', message: "Note not found" });
        }

        await noteModel.updateById(id, { judul, isi });
        res.status(200).json({ status: 'success', message: 'Catatan berhasil diperbarui' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// 4. Hapus catatan
const deleteNote = async (req, res) => {
    const { id } = req.params;
    try {
        const note = await noteModel.findById(id);

        if (!note) {
            return res.status(404).json({ status: 'error', message: "Note not found" });
        }

        await noteModel.deleteById(id);
        res.status(200).json({ status: 'success', message: 'Catatan berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

module.exports = {
    getNotes,
    addNote,
    updateNote,
    deleteNote,
};