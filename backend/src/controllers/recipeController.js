// backend/src/controllers/recipeController.js
const db = require('../db'); // Import koneksi database (path sudah benar dari src/controllers)
const path = require('path');
const fs = require('fs');

// --- PERBAIKAN: Path untuk uploadsDir ---
// __dirname adalah D:\PEMWEB-TUBES\backend\src\controllers
// ../../../ akan membawa kita ke D:\PEMWEB-TUBES\backend
// Lalu masuk ke folder 'uploads'
const uploadsDir = path.join(__dirname, '../../../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Fungsi untuk menambah resep baru
exports.addRecipe = async (req, res) => {
    // --- PERBAIKAN: Ambil variabel dari req.body sesuai nama dari frontend ---
    // Pastikan nama variabel di sini sesuai dengan yang dikirim dari FormData di frontend (RecipeForm.js)
    const { namaPembuat, judulResep, alatBahan, caraMembuat, kategori } = req.body;
    let imageUrl = null;

    if (req.file) {
        // req.file.filename adalah nama file yang sudah disimpan Multer
        imageUrl = `${process.env.APP_URL || `http://localhost:${process.env.PORT}`}/uploads/${req.file.filename}`;
    }

    // --- PERBAIKAN: Deklarasi user_id sekali saja dan ambil dari req.user (middleware auth) atau default ---
    // Ini userId dari user yang login (jika ada middleware auth)
    // Jika tidak ada user login atau middleware auth, gunakan default (misal: 1)
    const userId = req.user ? req.user.id : 1; 

    // --- PERBAIKAN PENTING: Gunakan nama kolom database yang BENAR di query INSERT ---
    // - 'ingredients' untuk 'alatBahan'
    // - 'description' untuk 'caraMembuat'
    const query = `
        INSERT INTO recipes (user_id, title, ingredients, description, category, image_url)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    // --- Pastikan urutan values sesuai dengan urutan kolom di query ---
    const values = [userId, judulResep, alatBahan, caraMembuat, kategori, imageUrl];

    try {
        const [result] = await db.execute(query, values);
        res.status(201).json({
            message: 'Resep berhasil ditambahkan!',
            recipe: {
                id: result.insertId,
                user_id: userId,
                namaPembuat, // Ini nama pembuat dari frontend, tidak disimpan di tabel 'recipes' di DB
                judulResep,
                alatBahan, // Ini nilai 'alatBahan' yang datang dari frontend
                caraMembuat, // Ini nilai 'caraMembuat' yang datang dari frontend
                kategori, 
                image_url: imageUrl
            }
        });
    } catch (error) {
        console.error('Error adding recipe:', error);
        // Jika ada error saat menyimpan ke DB, hapus file yang sudah diupload untuk membersihkan
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting uploaded file on DB error:', err);
            });
        }
        res.status(500).json({ message: 'Gagal menambahkan resep.', error: error.message });
    }
};

// Fungsi untuk mendapatkan semua resep
exports.getAllRecipes = async (req, res) => {
    try {
        // --- PERBAIKAN PENTING: Gunakan nama kolom database yang BENAR di query SELECT ---
        const [rows] = await db.execute(`SELECT id, user_id, title, ingredients, description, category, image_url, created_at FROM recipes`);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ message: 'Gagal mengambil resep.', error: error.message });
    }
};

// Fungsi untuk mendapatkan resep saya (berdasarkan user_id)
exports.getUserRecipes = async (req, res) => {
    // userId di sini harusnya diambil dari req.user.id setelah autentikasi untuk keamanan
    // Mengambil dari req.params.userId untuk contoh, tapi hati-hati di produksi tanpa auth
    const { userId } = req.params; 
    try {
        // --- PERBAIKAN PENTING: Gunakan nama kolom database yang BENAR di query SELECT ---
        const [rows] = await db.execute(`SELECT id, user_id, title, ingredients, description, category, image_url, created_at FROM recipes WHERE user_id = ?`, [userId]);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching user recipes:', error);
        res.status(500).json({ message: 'Gagal mengambil resep saya.', error: error.message });
    }
};

// Fungsi untuk mendapatkan resep populer (contoh: 8 resep terbaru)
exports.getPopularRecipes = async (req, res) => {
    try {
        // --- PERBAIKAN PENTING: Gunakan nama kolom database yang BENAR di query SELECT ---
        const [rows] = await db.execute(`SELECT id, user_id, title, ingredients, description, category, image_url, created_at FROM recipes ORDER BY id DESC LIMIT 8`);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching popular recipes:', error);
        res.status(500).json({ message: 'Gagal mengambil resep populer.', error: error.message });
    }
};

// Fungsi untuk mendapatkan resep berdasarkan kategori
exports.getRecipesByCategory = async (req, res) => {
    const { categoryName } = req.params;
    try {
        // --- PERBAIKAN PENTING: Gunakan nama kolom database yang BENAR di query SELECT ---
        const [rows] = await db.execute(`SELECT id, user_id, title, ingredients, description, category, image_url, created_at FROM recipes WHERE category = ?`, [categoryName]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(`Error fetching ${categoryName} recipes:`, error);
        res.status(500).json({ message: `Gagal mengambil resep ${categoryName}.`, error: error.message });
    }
};