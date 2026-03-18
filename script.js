// URL Backend API
const API_URL = 'http://localhost:5000/api/notes';

// Referensi elemen DOM
const noteForm = document.getElementById('note-form');
const judulInput = document.getElementById('judul');
const isiInput = document.getElementById('isi');
const noteIdInput = document.getElementById('note-id');
const notesList = document.getElementById('notes-list');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formTitle = document.getElementById('form-title');

// Event Listener saat halaman dimuat
document.addEventListener('DOMContentLoaded', fetchNotes);

// Event Listener saat form disubmit (Bisa untuk Tambah atau Edit)
noteForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Mencegah halaman reload

    const noteData = {
        judul: judulInput.value,
        isi: isiInput.value
    };

    const id = noteIdInput.value;

    if (id) {
        // Jika ada ID, berarti mode EDIT
        await updateNote(id, noteData);
    } else {
        // Jika tidak ada ID, berarti mode TAMBAH
        await addNote(noteData);
    }
});

// Event Listener tombol Batal Edit
cancelBtn.addEventListener('click', resetForm);

// ==========================================
// FUNGSI CRUD (Berkomunikasi dengan Backend)
// ==========================================

// 1. LIHAT CATATAN (READ)
async function fetchNotes() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();

        notesList.innerHTML = ''; // Bersihkan container

        if (result.data && result.data.length > 0) {
            result.data.forEach(note => {
                const noteEl = document.createElement('div');
                noteEl.className = 'note-card';

                // Format tanggal dari MySQL agar lebih mudah dibaca
                const date = new Date(note.tanggal_dibuat).toLocaleString('id-ID');

                noteEl.innerHTML = `
                    <div class="note-header">
                        <div class="note-title">${note.judul}</div>
                        <div class="note-date">Dibuat: ${date}</div>
                    </div>
                    <div class="note-body">${note.isi}</div>
                    <div class="note-actions">
                        <button class="btn-warning" onclick="editNoteMode(${note.id}, '${note.judul.replace(/'/g, "\\'")}', '${note.isi.replace(/'/g, "\\'")}')">Edit</button>
                        <button class="btn-danger" onclick="deleteNote(${note.id})">Hapus</button>
                    </div>
                `;
                notesList.appendChild(noteEl);
            });
        } else {
            notesList.innerHTML = '<p>Belum ada catatan. Silakan tambah catatan baru.</p>';
        }
    } catch (error) {
        console.error('Error fetching notes:', error);
        notesList.innerHTML = '<p style="color:red;">Gagal memuat data dari server. Pastikan backend berjalan.</p>';
    }
}

// 2. TAMBAH CATATAN (CREATE)
async function addNote(noteData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteData)
        });

        if (response.ok) {
            resetForm();
            fetchNotes(); // Reload daftar catatan
        } else {
            alert('Gagal menambahkan catatan');
        }
    } catch (error) {
        console.error('Error adding note:', error);
    }
}

// 3. EDIT CATATAN (UPDATE)
async function updateNote(id, noteData) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteData)
        });

        if (response.ok) {
            resetForm();
            fetchNotes(); // Reload daftar catatan
        } else {
            alert('Gagal mengupdate catatan');
        }
    } catch (error) {
        console.error('Error updating note:', error);
    }
}

// 4. HAPUS CATATAN (DELETE)
async function deleteNote(id) {
    if (confirm('Apakah Anda yakin ingin menghapus catatan ini?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchNotes(); // Reload daftar catatan
            } else {
                alert('Gagal menghapus catatan');
            }
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    }
}

// ==========================================
// FUNGSI HELPER
// ==========================================

// Mengubah form menjadi mode edit
function editNoteMode(id, judul, isi) {
    noteIdInput.value = id;
    judulInput.value = judul;
    isiInput.value = isi;

    formTitle.textContent = "Edit Catatan";
    submitBtn.textContent = "Update Catatan";
    cancelBtn.style.display = "inline-block";

    // Scroll otomatis ke atas (ke form)
    window.scrollTo(0, 0);
}

// Mereset form kembali ke mode tambah
function resetForm() {
    noteForm.reset();
    noteIdInput.value = '';

    formTitle.textContent = "Tambah Catatan Baru";
    submitBtn.textContent = "Simpan Catatan";
    cancelBtn.style.display = "none";
}