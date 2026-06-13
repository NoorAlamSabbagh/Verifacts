const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Case',
    required: true
  },
  previousStatus: String,
  newStatus: {
    type: String,
    enum: ['New', 'Assigned', 'In Progress', 'Submitted', 'Cleared', 'Discrepant'],
    required: true
  },
  changedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  note: String
}, {
  timestamps: true
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
