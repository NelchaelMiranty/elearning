import express from 'express';
import Course from '../models/Course.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Obtenir tous les cours
router.get('/', auth, async (req, res) => {
  try {
    const { category, level, search, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };

    // Filtres
    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }

    // Si c'est un étudiant, ne montrer que ses cours
    if (req.user.role === 'student') {
      const user = await User.findById(req.user.userId);
      query._id = { $in: user.courses };
    }

    const courses = await Course.find(query)
      .populate('teacher', 'firstName lastName email')
      .populate('students', 'firstName lastName matricule')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Course.countDocuments(query);

    res.json({
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Erreur récupération cours:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des cours' });
  }
});

// Créer un nouveau cours (teacher/admin seulement)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const courseData = {
      ...req.body,
      teacher: req.user.userId
    };

    const course = new Course(courseData);
    await course.save();

    await course.populate('teacher', 'firstName lastName email');

    res.status(201).json({
      message: 'Cours créé avec succès',
      course
    });
  } catch (error) {
    console.error('Erreur création cours:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Un cours avec ce code existe déjà' });
    } else {
      res.status(500).json({ message: 'Erreur lors de la création du cours' });
    }
  }
});

// Obtenir un cours par ID
router.get('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('teacher', 'firstName lastName email avatar')
      .populate('students', 'firstName lastName matricule avatar');

    if (!course) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }

    // Vérifier les permissions
    const isEnrolled = course.students.some(student => 
      student._id.toString() === req.user.userId
    );
    const isTeacher = course.teacher._id.toString() === req.user.userId;
    const isAdmin = req.user.role === 'admin';

    if (!isEnrolled && !isTeacher && !isAdmin) {
      return res.status(403).json({ message: 'Accès non autorisé à ce cours' });
    }

    res.json(course);
  } catch (error) {
    console.error('Erreur récupération cours:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du cours' });
  }
});

// Mettre à jour un cours
router.put('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }

    // Vérifier les permissions
    if (course.teacher.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('teacher', 'firstName lastName email');

    res.json({
      message: 'Cours mis à jour avec succès',
      course: updatedCourse
    });
  } catch (error) {
    console.error('Erreur mise à jour cours:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du cours' });
  }
});

// S'inscrire à un cours
router.post('/:id/enroll', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Seuls les étudiants peuvent s\'inscrire aux cours' });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }

    const user = await User.findById(req.user.userId);
    
    // Vérifier si déjà inscrit
    if (course.students.includes(req.user.userId)) {
      return res.status(400).json({ message: 'Déjà inscrit à ce cours' });
    }

    // Ajouter l'étudiant au cours
    await course.addStudent(req.user.userId);
    
    // Ajouter le cours à l'utilisateur
    user.courses.push(course._id);
    await user.save();

    res.json({ message: 'Inscription réussie au cours' });
  } catch (error) {
    console.error('Erreur inscription cours:', error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription au cours' });
  }
});

// Se désinscrire d'un cours
router.delete('/:id/unenroll', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }

    const user = await User.findById(req.user.userId);
    
    // Retirer l'étudiant du cours
    await course.removeStudent(req.user.userId);
    
    // Retirer le cours de l'utilisateur
    user.courses = user.courses.filter(courseId => 
      !courseId.equals(course._id)
    );
    await user.save();

    res.json({ message: 'Désinscription réussie du cours' });
  } catch (error) {
    console.error('Erreur désinscription cours:', error);
    res.status(500).json({ message: 'Erreur lors de la désinscription du cours' });
  }
});

// Ajouter du matériel pédagogique
router.post('/:id/materials', auth, upload.single('file'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }

    // Vérifier les permissions
    if (course.teacher.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const material = {
      title: req.body.title,
      type: req.body.type,
      url: req.file ? `/uploads/materials/${req.file.filename}` : req.body.url
    };

    await course.addMaterial(material);

    res.json({
      message: 'Matériel ajouté avec succès',
      material
    });
  } catch (error) {
    console.error('Erreur ajout matériel:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout du matériel' });
  }
});

// Supprimer un cours
router.delete('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }

    // Vérifier les permissions
    if (course.teacher.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.json({ message: 'Cours supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression cours:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du cours' });
  }
});

export default router;