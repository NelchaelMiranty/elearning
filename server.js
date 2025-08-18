const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const chatRoutes = require('./routes/chat');
const fileRoutes = require('./routes/files');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware de sécurité
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite chaque IP à 100 requêtes par windowMs
});
app.use(limiter);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir les fichiers statiques
app.use('/uploads', express.static('uploads'));

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elearning-fjkm', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connexion MongoDB réussie'))
.catch(err => console.error('❌ Erreur connexion MongoDB:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/files', fileRoutes);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Serveur E-Learning FJKM fonctionnel',
    timestamp: new Date().toISOString()
  });
});

// Gestion des connexions Socket.IO pour le chat en temps réel
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('👤 Utilisateur connecté:', socket.id);

  // Rejoindre une salle de cours
  socket.on('join-course', (courseId, userId, userName) => {
    socket.join(courseId);
    connectedUsers.set(socket.id, { userId, userName, courseId });
    
    // Notifier les autres utilisateurs
    socket.to(courseId).emit('user-joined', { userId, userName });
    
    // Envoyer la liste des utilisateurs connectés
    const courseUsers = Array.from(connectedUsers.values())
      .filter(user => user.courseId === courseId);
    io.to(courseId).emit('users-list', courseUsers);
  });

  // Envoyer un message
  socket.on('send-message', (data) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      const messageData = {
        ...data,
        userId: user.userId,
        userName: user.userName,
        timestamp: new Date()
      };
      
      if (data.isPrivate && data.recipientId) {
        // Message privé
        const recipientSocket = Array.from(connectedUsers.entries())
          .find(([_, userData]) => userData.userId === data.recipientId);
        
        if (recipientSocket) {
          socket.to(recipientSocket[0]).emit('private-message', messageData);
          socket.emit('private-message', messageData); // Confirmer à l'expéditeur
        }
      } else {
        // Message public
        io.to(user.courseId).emit('public-message', messageData);
      }
    }
  });

  // Gestion de la présence
  socket.on('update-presence', (isPresent) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      user.isPresent = isPresent;
      io.to(user.courseId).emit('presence-updated', {
        userId: user.userId,
        isPresent
      });
    }
  });

  // Déconnexion
  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      socket.to(user.courseId).emit('user-left', {
        userId: user.userId,
        userName: user.userName
      });
      connectedUsers.delete(socket.id);
    }
    console.log('👤 Utilisateur déconnecté:', socket.id);
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📱 Socket.IO activé pour le chat en temps réel`);
});

module.exports = { app, io };