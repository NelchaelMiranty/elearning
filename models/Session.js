const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  presentation: {
    title: String,
    url: String,
    slides: [String],
    currentSlide: {
      type: Number,
      default: 0
    }
  },
  attendees: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    leftAt: Date,
    isPresent: {
      type: Boolean,
      default: true
    }
  }],
  recordings: [{
    title: String,
    url: String,
    duration: Number,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index pour améliorer les performances
sessionSchema.index({ course: 1, startTime: -1 });
sessionSchema.index({ teacher: 1 });
sessionSchema.index({ isActive: 1 });

module.exports = mongoose.model('Session', sessionSchema);