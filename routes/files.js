const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Upload de fichier
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier fourni' });
    }

    const fileInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
      uploadedBy: req.user.userId,
      uploadedAt: new Date()
    };

    res.json({
      message: 'Fichier uploadé avec succès',
      file: fileInfo
    });
  } catch (error) {
    console.error('Erreur upload fichier:', error);
    res.status(500).json({ message: 'Erreur lors de l\'upload du fichier' });
  }
});

// Upload multiple de fichiers
router.post('/upload-multiple', auth, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Aucun fichier fourni' });
    }

    const filesInfo = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`,
      uploadedBy: req.user.userId,
      uploadedAt: new Date()
    }));

    res.json({
      message: 'Fichiers uploadés avec succès',
      files: filesInfo
    });
  } catch (error) {
    console.error('Erreur upload fichiers:', error);
    res.status(500).json({ message: 'Erreur lors de l\'upload des fichiers' });
  }
});

// Télécharger un fichier
router.get('/download/:filename', auth, async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);

    // Vérifier si le fichier existe
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({ message: 'Fichier non trouvé' });
    }

    // Envoyer le fichier
    res.download(filePath, (err) => {
      if (err) {
        console.error('Erreur téléchargement:', err);
        res.status(500).json({ message: 'Erreur lors du téléchargement' });
      }
    });
  } catch (error) {
    console.error('Erreur téléchargement fichier:', error);
    res.status(500).json({ message: 'Erreur lors du téléchargement du fichier' });
  }
});

// Supprimer un fichier
router.delete('/:filename', auth, async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);

    // Vérifier si le fichier existe
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({ message: 'Fichier non trouvé' });
    }

    // Supprimer le fichier
    await fs.unlink(filePath);

    res.json({ message: 'Fichier supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression fichier:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du fichier' });
  }
});

// Obtenir les informations d'un fichier
router.get('/info/:filename', auth, async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);

    // Vérifier si le fichier existe et obtenir ses stats
    try {
      const stats = await fs.stat(filePath);
      
      res.json({
        filename,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
        url: `/uploads/${filename}`
      });
    } catch (error) {
      return res.status(404).json({ message: 'Fichier non trouvé' });
    }
  } catch (error) {
    console.error('Erreur info fichier:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des informations du fichier' });
  }
});

module.exports = router;