const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Case',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);
