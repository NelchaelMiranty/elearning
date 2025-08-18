# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Backend Node.js + MongoDB

Le backend est configuré avec:
- **Express.js** pour l'API REST
- **MongoDB** avec Mongoose pour la base de données
- **Socket.IO** pour le chat en temps réel
- **JWT** pour l'authentification
- **Multer** pour l'upload de fichiers
- **Bcrypt** pour le hashage des mots de passe

### Installation et démarrage

1. Installer les dépendances:
```bash
npm install
```

2. Configurer les variables d'environnement dans `.env`:
```
MONGODB_URI=mongodb://localhost:27017/elearning-fjkm
JWT_SECRET=votre_secret_jwt_super_securise
PORT=5000
CLIENT_URL=http://localhost:5173
```

3. Démarrer MongoDB sur votre machine

4. Démarrer le serveur backend:
```bash
npm run server:dev
```

5. Démarrer le frontend:
```bash
npm run dev
```

### API Endpoints

#### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/verify` - Vérifier le token
- `PUT /api/auth/change-password` - Changer le mot de passe

#### Utilisateurs
- `GET /api/users/profile` - Profil utilisateur
- `PUT /api/users/profile` - Mettre à jour le profil
- `GET /api/users` - Liste des utilisateurs (admin/teacher)
- `GET /api/users/:id` - Utilisateur par ID

#### Cours
- `GET /api/courses` - Liste des cours
- `POST /api/courses` - Créer un cours (teacher/admin)
- `GET /api/courses/:id` - Cours par ID
- `PUT /api/courses/:id` - Mettre à jour un cours
- `POST /api/courses/:id/enroll` - S'inscrire à un cours
- `DELETE /api/courses/:id/unenroll` - Se désinscrire

#### Chat
- `GET /api/chat/course/:courseId` - Messages d'un cours
- `POST /api/chat/send` - Envoyer un message
- `GET /api/chat/conversations` - Conversations privées

#### Fichiers
- `POST /api/files/upload` - Upload de fichier
- `GET /api/files/download/:filename` - Télécharger un fichier
- `DELETE /api/files/:filename` - Supprimer un fichier

### Fonctionnalités

- ✅ Authentification JWT sécurisée
- ✅ Gestion des rôles (étudiant, enseignant, admin)
- ✅ Chat en temps réel avec Socket.IO
- ✅ Upload et gestion de fichiers
- ✅ Système de cours complet
- ✅ Messages privés et publics
- ✅ Sécurité avec helmet et rate limiting
- ✅ Validation des données
- ✅ Gestion d'erreurs complète

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
