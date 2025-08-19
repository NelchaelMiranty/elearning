import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import { Server as SocketIo } from "socket.io";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Configuration ES Module pour __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement
dotenv.config();

// Importer les routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import courseRoutes from "./routes/courses.js";
import chatRoutes from "./routes/chat.js";
import fileRoutes from "./routes/files.js";

const app = express();
const server = createServer(app);
const io = new SocketIo(server, {
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
  max: 100
});
app.use(limiter);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Servir les fichiers statiques
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/elearning-fjkm", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connexion MongoDB réussie"))
.catch(err => console.error("❌ Erreur connexion MongoDB:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/files", fileRoutes);

// Route de test
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Serveur E-Learning FJKM fonctionnel",
    timestamp: new Date().toISOString()
  });
});

// Gestion des connexions Socket.IO pour le chat en temps réel
const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log("👤 Utilisateur connecté:", socket.id);

  socket.on("join-course", (courseId, userId, userName) => {
    socket.join(courseId);
    connectedUsers.set(socket.id, { userId, userName, courseId });
    
    socket.to(courseId).emit("user-joined", { userId, userName });
    
    const courseUsers = Array.from(connectedUsers.values())
      .filter(user => user.courseId === courseId);
    io.to(courseId).emit("users-list", courseUsers);
  });

  socket.on("send-message", (data) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      const messageData = {
        ...data,
        userId: user.userId,
        userName: user.userName,
        timestamp: new Date()
      };
      
      if (data.isPrivate && data.recipientId) {
        const recipientSocket = Array.from(connectedUsers.entries())
          .find(([_, userData]) => userData.userId === data.recipientId);
        
        if (recipientSocket) {
          socket.to(recipientSocket[0]).emit("private-message", messageData);
          socket.emit("private-message", messageData);
        }
      } else {
        io.to(user.courseId).emit("public-message", messageData);
      }
    }
  });

  socket.on("update-presence", (isPresent) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      user.isPresent = isPresent;
      io.to(user.courseId).emit("presence-updated", {
        userId: user.userId,
        isPresent
      });
    }
  });

  socket.on("disconnect", () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      socket.to(user.courseId).emit("user-left", {
        userId: user.userId,
        userName: user.userName
      });
      connectedUsers.delete(socket.id);
    }
    console.log("👤 Utilisateur déconnecté:", socket.id);
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: "Erreur interne du serveur",
    error: process.env.NODE_ENV === "development" ? err.message : {}
  });
});

// Route 404
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route non trouvée" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log("📱 Socket.IO activé pour le chat en temps réel");
});

export { app, io };