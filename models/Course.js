const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  category: {
    type: String,
    required: true,
    enum: ['informatique', 'mathematiques', 'sciences', 'langues', 'autre']
  },
  level: {
    type: String,
    required: true,
    enum: ['debutant', 'intermediaire', 'avance']
  },
  duration: {
    type: Number, // en heures
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  schedule: {
    dayOfWeek: {
      type: String,
      enum: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']
    },
    startTime: String,
    endTime: String
  },
  materials: [{
    title: String,
    type: {
      type: String,
      enum: ['pdf', 'video', 'presentation', 'document', 'link']
    },
    url: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  announcements: [{
    title: String,
    content: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index pour améliorer les performances
courseSchema.index({ code: 1 });
courseSchema.index({ teacher: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ isActive: 1 });

// Méthode pour ajouter un étudiant au cours
courseSchema.methods.addStudent = function(studentId) {
  if (!this.students.includes(studentId)) {
    this.students.push(studentId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Méthode pour retirer un étudiant du cours
courseSchema.methods.removeStudent = function(studentId) {
  this.students = this.students.filter(id => !id.equals(studentId));
  return this.save();
};

// Méthode pour ajouter du matériel pédagogique
courseSchema.methods.addMaterial = function(material) {
  this.materials.push(material);
  return this.save();
};

module.exports = mongoose.model('Course', courseSchema);