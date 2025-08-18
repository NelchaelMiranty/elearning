const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Créer les dossiers d'upload s'ils n'existent pas
const uploadDirs = ['uploads', 'uploads/avatars', 'uploads/materials', 'uploads/presentations'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    
    // Déterminer le dossier selon le type de fichier
    if (req.route.path.includes('avatar')) {
      uploadPath += 'avatars/';
    } else if (req.route.path.includes('material')) {
      uploadPath += 'materials/';
    } else if (file.mimetype.includes('presentation') || 
               file.originalname.match(/\.(ppt|pptx)$/i)) {
      uploadPath += 'presentations/';
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Générer un nom unique pour le fichier
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// Filtres de fichiers
const fileFilter = (req, file, cb) => {
  // Types de fichiers autorisés
  const allowedTypes = {
    'image/jpeg': true,
    'image/jpg': true,
    'image/png': true,
    'image/gif': true,
    'image/webp': true,
    'application/pdf': true,
    'application/msword': true,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': true,
    'application/vnd.ms-powerpoint': true,
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': true,
    'application/vnd.ms-excel': true,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': true,
    'text/plain': true,
    'video/mp4': true,
    'video/avi': true,
    'video/mov': true,
    'audio/mp3': true,
    'audio/wav': true,
    'audio/mpeg': true
  };

  if (allowedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error(`Type de fichier non autorisé: ${file.mimetype}`), false);
  }
};

// Configuration de multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB par défaut
    files: 10 // Maximum 10 fichiers
  }
});

// Middleware de gestion d'erreurs pour multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        message: 'Fichier trop volumineux. Taille maximale: 10MB' 
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        message: 'Trop de fichiers. Maximum: 10 fichiers' 
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ 
        message: 'Champ de fichier inattendu' 
      });
    }
  }
  
  if (err.message.includes('Type de fichier non autorisé')) {
    return res.status(400).json({ message: err.message });
  }
  
  next(err);
};

module.exports = upload;
module.exports.handleMulterError = handleMulterError;