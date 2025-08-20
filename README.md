# E-Learning FJKM

Plateforme d'apprentissage en ligne pour l'Université FJKM Ravelojaona avec architecture séparée backend/frontend utilisant ES Modules.

## Architecture

- **Backend** : Node.js + Express + MongoDB (ES Modules)
- **Frontend** : React + Vite + Ant Design
- **Communication** : REST API + Socket.IO pour le chat temps réel

## Installation

### Installation complète
```bash
npm run install:all
```

### Installation manuelle
```bash
# Dépendances racine
npm install

# Backend
cd backend
npm install

# Frontend  
cd ../frontend
npm install
```

## Configuration

### Backend (.env)
Créez un fichier `.env` dans le dossier `backend/` :

```env
MONGODB_URI=mongodb://localhost:27017/elearning-fjkm
JWT_SECRET=votre_secret_jwt_super_securise
JWT_EXPIRE=7d
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
MAX_FILE_SIZE=10485760
```

## Démarrage

### Développement (Backend + Frontend)
```bash
npm run dev
```

### Séparément
```bash
# Backend seulement
npm run backend:dev

# Frontend seulement  
npm run frontend:dev
```

### Production
```bash
# Backend
npm run backend:start

# Frontend (build)
npm run frontend:build
```

## Structure du projet

```
├── backend/
│   ├── models/          # Modèles Mongoose
│   ├── routes/          # Routes API
│   ├── middleware/      # Middlewares (auth, upload)
│   ├── uploads/         # Fichiers uploadés
│   ├── server.js        # Serveur principal
│   └── package.json     # Dépendances backend
├── frontend/
│   ├── src/            # Code source React
│   ├── public/         # Fichiers statiques
│   ├── index.html      # Point d'entrée HTML
│   └── package.json    # Dépendances frontend
└── package.json        # Scripts globaux
```

## Fonctionnalités

### Backend (ES Modules)
- ✅ API REST avec Express
- ✅ Authentification JWT
- ✅ Base de données MongoDB avec Mongoose
- ✅ Chat temps réel avec Socket.IO
- ✅ Upload de fichiers avec Multer
- ✅ Sécurité (Helmet, CORS, Rate Limiting)
- ✅ Gestion des rôles (étudiant, enseignant, admin)

### Frontend
- ✅ Interface React avec Ant Design
- ✅ Routing avec React Router
- ✅ Chat en temps réel
- ✅ Gestion des cours et présentations
- ✅ Upload et visualisation de fichiers
- ✅ Authentification utilisateur

## API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/verify` - Vérifier le token

### Utilisateurs
- `GET /api/users/profile` - Profil utilisateur
- `PUT /api/users/profile` - Mettre à jour le profil

### Cours
- `GET /api/courses` - Liste des cours
- `POST /api/courses` - Créer un cours
- `GET /api/courses/:id` - Détails d'un cours

### Chat
- `GET /api/chat/course/:courseId` - Messages d'un cours
- `POST /api/chat/send` - Envoyer un message

### Fichiers
- `POST /api/files/upload` - Upload de fichier
- `GET /api/files/download/:filename` - Télécharger un fichier

## Technologies utilisées

### Backend
- Node.js (ES Modules)
- Express.js
- MongoDB + Mongoose
- Socket.IO
- JWT + Bcrypt
- Multer
- Helmet + CORS

### Frontend
- React 19
- Vite
- Ant Design
- React Router
- Socket.IO Client
- Bootstrap + AOS

## Développement

Le projet utilise maintenant **ES Modules** exclusivement :
- `import/export` au lieu de `require/module.exports`
- `"type": "module"` dans tous les package.json
- Configuration adaptée pour Node.js et Vite

## Support

Pour toute question ou problème, contactez l'équipe de développement.