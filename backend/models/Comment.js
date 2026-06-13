const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Case',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Comment', commentSchema);
