const db = require('../db'); // Import koneksi database
const path = require('path');
const fs = require('fs'); // Node.js built-in for file system operations

// Pastikan folder uploads ada
const uploadsDir = path.join(__dirname, 'backend/uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Fungsi untuk menambah resep baru
exports.addRecipe = async (req, res) => {
    // --- KUNCI: Ambil 'kategori' dari req.body ---
    const { namaPembuat, judulResep, alatBahan, caraMembuat, kategori } = req.body;
    let imageUrl = null;

    if (req.file) {
        imageUrl = `${process.env.APP_URL || `http://localhost:${process.env.PORT}`}/uploads/${req.file.filename}`;
    }

    // Asumsi user_id diambil dari token autentikasi atau sesi
    const user_id = req.user ? req.user.id : 1; // Jika ada req.user dari middleware auth, gunakan itu. Default 1.

    // --- KUNCI: Tambahkan 'category' ke query INSERT ---
    // Sesuaikan nama kolom: description di DB = caraMembuat, ingredients di DB = alatBahan
    const query = `
        INSERT INTO recipes (user_id, title, alatBahan, caraMembuat, category, image_url)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    // --- KUNCI: Tambahkan 'kategori' ke array values ---
    const values = [user_id, judulResep, alatBahan, caraMembuat, kategori, imageUrl];

    try {
        const [result] = await db.execute(query, values);
        res.status(201).json({
            message: 'Resep berhasil ditambahkan!',
            recipe: {
                id: result.insertId,
                user_id: user_id,
                namaPembuat, // Perlu dicatat, namaPembuat tidak disimpan di tabel recipes sesuai skema kamu. Jika perlu, tambahkan.
                judulResep,
                alatBahan,
                caraMembuat,
                kategori, // Termasuk kategori di respons
                image_url: imageUrl
            }
        });
    } catch (error) {
        console.error('Error adding recipe:', error);
        // Jika ada error saat menyimpan ke DB, hapus file yang sudah diupload
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting uploaded file:', err);
            });
        }
        res.status(500).json({ message: 'Gagal menambahkan resep.', error: error.message });
    }
};

// Fungsi untuk mendapatkan semua resep (pastikan mengambil kolom 'category' juga)
exports.getAllRecipes = async (req, res) => {
    try {
        const [rows] = await db.execute(`SELECT id, user_id, title, alatBahan, caraMembuat, category, image_url, created_at FROM recipes`);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ message: 'Gagal mengambil resep.', error: error.message });
    }
};

// Fungsi untuk mendapatkan resep saya (berdasarkan user_id)
exports.getUserRecipes = async (req, res) => {
    const { userId } = req.params; // Untuk contoh ini kita pakai params, tapi hati-hati di produksi
    try {
        const [rows] = await db.execute(`SELECT id, user_id, title, alatBahan, caraMembuat, category, image_url, created_at FROM recipes WHERE user_id = ?`, [userId]);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching user recipes:', error);
        res.status(500).json({ message: 'Gagal mengambil resep saya.', error: error.message });
    }
};

// Fungsi untuk mendapatkan resep populer (contoh: 8 resep terbaru)
exports.getPopularRecipes = async (req, res) => {
    try {
        const [rows] = await db.execute(`SELECT id, user_id, title, alatBahan, caraMembuat, category, image_url, created_at FROM recipes ORDER BY id DESC LIMIT 8`);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching popular recipes:', error);
        res.status(500).json({ message: 'Gagal mengambil resep populer.', error: error.message });
    }
};

// Fungsi untuk mendapatkan resep berdasarkan kategori
exports.getRecipesByCategory = async (req, res) => {
    const { categoryName } = req.params; // Asumsi categoryName dikirim di URL
    try {
        const [rows] = await db.execute(`SELECT id, user_id, title, alatBahan, caraMembuat, category, image_url, created_at FROM recipes WHERE category = ?`, [categoryName]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(`Error fetching ${categoryName} recipes:`, error);
        res.status(500).json({ message: `Gagal mengambil resep ${categoryName}.`, error: error.message });
    }
};