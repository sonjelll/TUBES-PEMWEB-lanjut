// backend/src/controllers/recipeController.js
const db = require('../db'); // Hanya satu kali deklarasi ini
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../../../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Fungsi untuk menambah resep baru
exports.addRecipe = async (req, res) => {
    // namaPembuat dari req.body tidak lagi digunakan jika kita mengambil dari token
    const { judulResep, alatBahan, caraMembuat, kategori } = req.body;
    let imageUrl = null;

    if (req.file) {
        imageUrl = `${process.env.APP_URL || `http://localhost:${process.env.PORT}`}/uploads/${req.file.filename}`;
    }

    // Pastikan req.user ada dari authMiddleware
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Akses ditolak. User tidak terautentikasi.' });
    }
    const userId = req.user.id;
    const namaPembuat = req.user.nama; // Ambil nama pembuat dari token

    const query = `
        INSERT INTO recipes (user_id, title, ingredients, description, category, image_url)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [userId, judulResep, alatBahan, caraMembuat, kategori, imageUrl];

    try {
        const [result] = await db.execute(query, values);
        res.status(201).json({
            message: 'Resep berhasil ditambahkan!',
            recipe: {
                id: result.insertId,
                user_id: userId,
                namaPembuat: namaPembuat, // Gunakan namaPembuat dari token
                judulResep,
                alatBahan,
                caraMembuat,
                kategori,
                image_url: imageUrl
            }
        });
    } catch (error) {
        console.error('Error adding recipe:', error);
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting uploaded file:', err);
            });
        }
        res.status(500).json({ message: 'Gagal menambahkan resep.', error: error.message });
    }
};

// Fungsi untuk mendapatkan semua resep
exports.getAllRecipes = async (req, res) => {
    try {
        const [rows] = await db.execute(`SELECT id, user_id, title, ingredients, description, category, image_url, created_at FROM recipes`);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ message: 'Gagal mengambil resep.', error: error.message });
    }
};

// Fungsi untuk mendapatkan resep user tertentu (Resep Saya)
exports.getUserRecipes = async (req, res) => {
    // userId diambil dari token JWT (req.user.id) yang sudah di-set oleh authMiddleware
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Akses ditolak. User tidak terautentikasi.' });
    }
    const userId = req.user.id;

    try {
        // Query resep berdasarkan user_id dari pengguna yang terautentikasi
        const [rows] = await db.execute(`SELECT id, user_id, title, ingredients, description, category, image_url, created_at FROM recipes WHERE user_id = ?`, [userId]);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching user recipes:', error);
        res.status(500).json({ message: 'Gagal mengambil resep.', error: error.message });
    }
};

// Fungsi untuk mendapatkan resep populer
exports.getPopularRecipes = async (req, res) => {
    try {
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
        const [rows] = await db.execute(`SELECT id, user_id, title, ingredients, description, category, image_url, created_at FROM recipes WHERE category = ?`, [categoryName]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(`Error fetching ${categoryName} recipes:`, error);
        res.status(500).json({ message: `Gagal mengambil resep ${categoryName}.`, error: error.message });
    }
};

// Fungsi untuk mendapatkan detail resep berdasarkan ID (untuk Edit)
exports.getRecipeById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute(`SELECT id, user_id, title, ingredients, description, category, image_url FROM recipes WHERE id = ?`, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Resep tidak ditemukan.' });
        }
        res.status(200).json(rows[0]); // Kirim objek resep pertama
    } catch (error) {
        console.error('Error fetching recipe by ID:', error);
        res.status(500).json({ message: 'Gagal mengambil resep.', error: error.message });
    }
};

// Fungsi untuk memperbarui resep
exports.updateRecipe = async (req, res) => {
    const { id } = req.params;
    // Pastikan req.user ada dari authMiddleware
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Akses ditolak. User tidak terautentikasi.' });
    }
    const userId = req.user.id;

    const { judulResep, alatBahan, caraMembuat, kategori } = req.body;
    let imageUrl = null; // Akan menyimpan URL gambar baru jika diupload

    try {
        // Cek kepemilikan dan dapatkan URL gambar lama jika ada
        const [oldRecipeRows] = await db.execute(`SELECT user_id, image_url FROM recipes WHERE id = ?`, [id]);
        if (oldRecipeRows.length === 0) {
            return res.status(404).json({ message: 'Resep tidak ditemukan.' });
        }
        const oldRecipe = oldRecipeRows[0];

        if (oldRecipe.user_id !== userId) {
            return res.status(403).json({ message: 'Anda tidak diizinkan mengedit resep ini.' });
        }

        imageUrl = oldRecipe.image_url; // Default: pertahankan gambar lama

        // Jika ada file baru diupload via Multer
        if (req.file) {
            imageUrl = `${process.env.APP_URL || `http://localhost:${process.env.PORT}`}/uploads/${req.file.filename}`;
            // Opsional: Hapus gambar lama dari server jika berbeda dan ada
            // if (oldRecipe.image_url && oldRecipe.image_url !== imageUrl) {
            //     const oldFileName = path.basename(oldRecipe.image_url);
            //     const oldFilePath = path.join(uploadsDir, oldFileName);
            //     if (fs.existsSync(oldFilePath)) {
            //         fs.unlink(oldFilePath, (err) => {
            //             if (err) console.error('Error deleting old image file:', err);
            //         });
            //     }
            // }
        } else if (req.body.removeImage === 'true' && oldRecipe.image_url) { // Jika ada indikasi untuk menghapus gambar
            imageUrl = null; // Set gambar menjadi null di DB
            // Hapus file fisik gambar lama
            // const oldFileName = path.basename(oldRecipe.image_url);
            // const oldFilePath = path.join(uploadsDir, oldFileName);
            // if (fs.existsSync(oldFilePath)) {
            //     fs.unlink(oldFilePath, (err) => {
            //         if (err) console.error('Error deleting old image file (on remove flag):', err);
            //     });
            // }
        }

        // Construct UPDATE query dynamically for provided fields
        const updateFields = [];
        const updateValues = [];

        // Add fields if they are defined (not undefined, null, or empty string depending on logic)
        // Here we update all fields from the form
        updateFields.push('title = ?'); updateValues.push(judulResep);
        updateFields.push('ingredients = ?'); updateValues.push(alatBahan);
        updateFields.push('description = ?'); updateValues.push(caraMembuat);
        updateFields.push('category = ?'); updateValues.push(kategori);
        updateFields.push('image_url = ?'); updateValues.push(imageUrl); // Update image_url based on logic above

        if (updateFields.length === 0) {
             return res.status(400).json({ message: 'Tidak ada data untuk diperbarui.' });
        }

        const query = `
            UPDATE recipes
            SET ${updateFields.join(', ')}
            WHERE id = ? AND user_id = ?
        `;
        const values = [...updateValues, id, userId];

        const [result] = await db.execute(query, values);

        if (result.affectedRows === 0) {
            // Jika affectedRows 0, bisa jadi ID tidak ditemukan atau tidak ada perubahan
            return res.status(404).json({ message: 'Resep tidak ditemukan atau tidak ada perubahan.' });
        }

        res.status(200).json({ message: 'Resep berhasil diperbarui!' });

    } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(500).json({ message: 'Gagal memperbarui resep.', error: error.message });
    }
};


// Fungsi untuk menghapus resep
exports.deleteRecipe = async (req, res) => {
    const { id } = req.params;
    // Pastikan req.user ada dari authMiddleware
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Akses ditolak. User tidak terautentikasi.' });
    }
    const userId = req.user.id;

    try {
        // Dapatkan info resep untuk cek kepemilikan dan URL gambar
        const [recipeRows] = await db.execute(`SELECT user_id, image_url FROM recipes WHERE id = ?`, [id]);
        if (recipeRows.length === 0) {
            return res.status(404).json({ message: 'Resep tidak ditemukan.' });
        }
        const recipeToDelete = recipeRows[0];

        if (recipeToDelete.user_id !== userId) {
            return res.status(403).json({ message: 'Anda tidak diizinkan menghapus resep ini.' });
        }

        // Hapus resep dari database
        const [result] = await db.execute(`DELETE FROM recipes WHERE id = ? AND user_id = ?`, [id, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Resep tidak ditemukan atau tidak dapat dihapus.' });
        }

        // Opsional: Hapus file gambar fisik dari server juga
        if (recipeToDelete.image_url) {
            const fileName = path.basename(recipeToDelete.image_url); // Ambil nama file dari URL
            const filePath = path.join(uploadsDir, fileName); // Buat path lengkap
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    if (err) console.error('Error deleting image file:', err);
                });
            }
        }

        res.status(200).json({ message: 'Resep berhasil dihapus!' });

    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).json({ message: 'Gagal menghapus resep.', error: error.message });
    }
};