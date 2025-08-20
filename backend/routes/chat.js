import express from 'express';
import Message from '../models/Message.js';
import Course from '../models/Course.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Obtenir les messages d'un cours
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { page = 1, limit = 50, isPrivate = false } = req.query;

    // Vérifier l'accès au cours
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }

    const isEnrolled = course.students.includes(req.user.userId);
    const isTeacher = course.teacher.toString() === req.user.userId;
    const isAdmin = req.user.role === 'admin';

    if (!isEnrolled && !isTeacher && !isAdmin) {
      return res.status(403).json({ message: 'Accès non autorisé à ce cours' });
    }

    // Construire la requête
    const query = { course: courseId };
    
    if (isPrivate === 'true') {
      // Messages privés impliquant l'utilisateur connecté
      query.$or = [
        { sender: req.user.userId, isPrivate: true },
        { recipient: req.user.userId, isPrivate: true }
      ];
    } else {
      // Messages publics seulement
      query.isPrivate = false;
    }

    const messages = await Message.find(query)
      .populate('sender', 'firstName lastName avatar matricule')
      .populate('recipient', 'firstName lastName avatar matricule')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Message.countDocuments(query);

    res.json({
      messages: messages.reverse(), // Inverser pour avoir les plus anciens en premier
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Erreur récupération messages:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des messages' });
  }
});

// Envoyer un message
router.post('/send', auth, async (req, res) => {
  try {
    const { content, courseId, recipientId, messageType = 'text' } = req.body;

    // Vérifier l'accès au cours
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }

    const isEnrolled = course.students.includes(req.user.userId);
    const isTeacher = course.teacher.toString() === req.user.userId;
    const isAdmin = req.user.role === 'admin';

    if (!isEnrolled && !isTeacher && !isAdmin) {
      return res.status(403).json({ message: 'Accès non autorisé à ce cours' });
    }

    // Créer le message
    const message = new Message({
      content,
      sender: req.user.userId,
      course: courseId,
      recipient: recipientId || null,
      isPrivate: !!recipientId,
      messageType
    });

    await message.save();
    await message.populate('sender', 'firstName lastName avatar matricule');
    
    if (recipientId) {
      await message.populate('recipient', 'firstName lastName avatar matricule');
    }

    res.status(201).json({
      message: 'Message envoyé avec succès',
      data: message
    });
  } catch (error) {
    console.error('Erreur envoi message:', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi du message' });
  }
});

// Marquer un message comme lu
router.patch('/:messageId/read', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }

    // Vérifier que l'utilisateur peut marquer ce message comme lu
    if (message.isPrivate && 
        message.recipient.toString() !== req.user.userId &&
        message.sender.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    // Ajouter à la liste des lecteurs si pas déjà présent
    const alreadyRead = message.readBy.some(read => 
      read.user.toString() === req.user.userId
    );

    if (!alreadyRead) {
      message.readBy.push({
        user: req.user.userId,
        readAt: new Date()
      });
      await message.save();
    }

    res.json({ message: 'Message marqué comme lu' });
  } catch (error) {
    console.error('Erreur marquage lecture:', error);
    res.status(500).json({ message: 'Erreur lors du marquage comme lu' });
  }
});

// Obtenir les conversations privées de l'utilisateur
router.get('/conversations', auth, async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: req.user.userId, isPrivate: true },
            { recipient: req.user.userId, isPrivate: true }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', req.user.userId] },
              '$recipient',
              '$sender'
            ]
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$recipient', req.user.userId] },
                    { $not: { $in: [req.user.userId, '$readBy.user'] } }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          user: {
            _id: '$user._id',
            firstName: '$user.firstName',
            lastName: '$user.lastName',
            avatar: '$user.avatar',
            matricule: '$user.matricule'
          },
          lastMessage: '$lastMessage',
          unreadCount: '$unreadCount'
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    res.json(conversations);
  } catch (error) {
    console.error('Erreur récupération conversations:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des conversations' });
  }
});

// Supprimer un message (auteur seulement)
router.delete('/:messageId', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }

    // Vérifier que l'utilisateur est l'auteur du message
    if (message.sender.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    await Message.findByIdAndDelete(req.params.messageId);

    res.json({ message: 'Message supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression message:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du message' });
  }
});

export default router;