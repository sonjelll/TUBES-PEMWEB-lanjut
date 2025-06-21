// backend/src/controllers/recipeController.js
const Recipe = require('../models/recipeModel');
const path = require('path');
const fs = require('fs');
const db = require('../db'); // Hapus .promise() karena objek db sudah menyediakan method execute secara langsung

const uploadsDir = path.join(__dirname, '../../../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Fungsi untuk menambah resep baru
exports.addRecipe = async (req, res) => {
    const { judulResep, alatBahan, caraMembuat, kategori } = req.body;
    let imageUrl = null;

    if (req.file) {
        imageUrl = `${process.env.APP_URL || `http://localhost:${process.env.PORT}`}/uploads/${req.file.filename}`;
    }

    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Akses ditolak. User tidak terautentikasi.' });
    }
    const userId = req.user.id;
    const namaPembuat = req.user.nama;

    try {
        const recipe = await Recipe.create({
            user_id: userId,
            title: judulResep,
            ingredients: alatBahan,
            description: caraMembuat,
            category: kategori,
            image_url: imageUrl,
        });
        res.status(201).json({
            message: 'Resep berhasil ditambahkan!',
            recipe: {
                id: recipe.id,
                user_id: userId,
                namaPembuat: namaPembuat,
                judulResep,
                alatBahan,
                caraMembuat,
                kategori,
                image_url: imageUrl,
            },
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
        const recipes = await Recipe.findAll();
        res.status(200).json(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ message: 'Gagal mengambil resep.', error: error.message });
    }
};

// Fungsi untuk mendapatkan resep user tertentu (Resep Saya)
exports.getUserRecipes = async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Akses ditolak. User tidak terautentikasi.' });
    }
    const userId = req.user.id;

    try {
        const recipes = await Recipe.findAll({ where: { user_id: userId } });
        res.status(200).json(recipes);
    } catch (error) {
        console.error('Error fetching user recipes:', error);
        res.status(500).json({ message: 'Gagal mengambil resep.', error: error.message });
    }
};

// Fungsi untuk mendapatkan resep populer
exports.getPopularRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.findAll({ order: [['id', 'DESC']], limit: 8 });
        res.status(200).json(recipes);
    } catch (error) {
        console.error('Error fetching popular recipes:', error);
        res.status(500).json({ message: 'Gagal mengambil resep populer.', error: error.message });
    }
};

// Fungsi untuk mendapatkan resep berdasarkan kategori
exports.getRecipesByCategory = async (req, res) => {
    const { categoryName } = req.params;
    try {
        const recipes = await Recipe.findAll({ where: { category: categoryName } });
        res.status(200).json(recipes);
    } catch (error) {
        console.error(`Error fetching ${categoryName} recipes:`, error);
        res.status(500).json({ message: `Gagal mengambil resep ${categoryName}.`, error: error.message });
    }
};

// Fungsi untuk mendapatkan detail resep berdasarkan ID (untuk Edit)
exports.getRecipeById = async (req, res) => {
    const { id } = req.params;
    try {
        const recipe = await Recipe.findByPk(id);
        if (!recipe) {
            return res.status(404).json({ message: 'Resep tidak ditemukan.' });
        }
        res.status(200).json(recipe);
    } catch (error) {
        console.error('Error fetching recipe by ID:', error);
        res.status(500).json({ message: 'Gagal mengambil resep.', error: error.message });
    }
};

// Fungsi untuk memperbarui resep
exports.updateRecipe = async (req, res) => {
    const { id } = req.params;
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Akses ditolak. User tidak terautentikasi.' });
    }
    const userId = req.user.id;

    const { judulResep, alatBahan, caraMembuat, kategori } = req.body;
    let imageUrl = null;

    try {
        const oldRecipe = await Recipe.findOne({ where: { id } });
        if (!oldRecipe) {
            return res.status(404).json({ message: 'Resep tidak ditemukan.' });
        }

        if (oldRecipe.user_id !== userId) {
            return res.status(403).json({ message: 'Anda tidak diizinkan mengedit resep ini.' });
        }

        imageUrl = oldRecipe.image_url;

        if (req.file) {
            imageUrl = `${process.env.APP_URL || `http://localhost:${process.env.PORT}`}/uploads/${req.file.filename}`;
            // Optional: delete old image file if needed
        } else if (req.body.removeImage === 'true' && oldRecipe.image_url) {
            imageUrl = null;
            // Optional: delete old image file if needed
        }

        const [updated] = await Recipe.update(
            {
                title: judulResep,
                ingredients: alatBahan,
                description: caraMembuat,
                category: kategori,
                image_url: imageUrl,
            },
            { where: { id, user_id: userId } }
        );

        if (updated === 0) {
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
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Akses ditolak. User tidak terautentikasi.' });
    }
    const userId = req.user.id;

    try {
        const recipeToDelete = await Recipe.findOne({ where: { id } });
        if (!recipeToDelete) {
            return res.status(404).json({ message: 'Resep tidak ditemukan.' });
        }

        console.log('User ID from token:', userId);
        console.log('User ID from recipe:', recipeToDelete.user_id);

        // Convert both to string for comparison to avoid type mismatch
        if (String(recipeToDelete.user_id) !== String(userId)) {
            return res.status(403).json({ message: 'Anda tidak diizinkan menghapus resep ini.' });
        }

        const deleted = await Recipe.destroy({ where: { id, user_id: userId } });
        if (deleted === 0) {
            return res.status(404).json({ message: 'Resep tidak ditemukan atau tidak dapat dihapus.' });
        }

        if (recipeToDelete.image_url) {
            const fileName = path.basename(recipeToDelete.image_url);
            const filePath = path.join(uploadsDir, fileName);
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Error deleting image file:', err);
                    }
                });
            }
        }

        res.status(200).json({ message: 'Resep berhasil dihapus!' });
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).json({ message: 'Gagal menghapus resep.', error: error.message });
    }
};
