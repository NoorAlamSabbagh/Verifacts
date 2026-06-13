const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: [true, 'Please add a client name']
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject']
  },
  caseType: {
    type: String,
    required: [true, 'Please add a case type']
  },
  dueDate: {
    type: Date,
    required: [true, 'Please add a due date']
  },
  status: {
    type: String,
    enum: ['New', 'Assigned', 'In Progress', 'Submitted', 'Cleared', 'Discrepant'],
    default: 'New'
  },
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  notes: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Case', caseSchema);
