const Case = require('../models/Case');
const AuditLog = require('../models/AuditLog');
const Document = require('../models/Document');
const Comment = require('../models/Comment');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const path = require('path');

exports.getCases = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'Agent') {
      // Agents can ONLY see their own cases - no overriding!
      query.assignedTo = req.user.id;
      
      if (req.query.status) {
        query.status = req.query.status;
      }

      if (req.query.search) {
        query.$or = [
          { clientName: { $regex: req.query.search, $options: 'i' } },
          { subject: { $regex: req.query.search, $options: 'i' } }
        ];
      }
    } else {
      // Managers can filter any way
      if (req.query.status) {
        query.status = req.query.status;
      }

      if (req.query.assignedTo) {
        query.assignedTo = req.query.assignedTo;
      }

      if (req.query.search) {
        query.$or = [
          { clientName: { $regex: req.query.search, $options: 'i' } },
          { subject: { $regex: req.query.search, $options: 'i' } }
        ];
      }
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const cases = await Case.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Case.countDocuments(query);

    res.status(200).json({
      success: true,
      data: cases,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getCase = async (req, res, next) => {
  try {
    const caseData = await Case.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!caseData) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    if (req.user.role === 'Agent') {
      if (!caseData.assignedTo || caseData.assignedTo._id.toString() !== req.user.id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to access this case' });
      }
    }

    const documents = await Document.find({ caseId: caseData._id }).populate('uploadedBy', 'name email');
    const comments = await Comment.find({ caseId: caseData._id }).populate('createdBy', 'name email');
    const auditLogs = await AuditLog.find({ caseId: caseData._id }).populate('changedBy', 'name email').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        case: caseData,
        documents,
        comments,
        auditLogs
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.createCase = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { clientName, subject, caseType, dueDate } = req.body;

    const caseData = await Case.create({
      clientName,
      subject,
      caseType,
      dueDate,
      createdBy: req.user.id
    });

    await AuditLog.create({
      caseId: caseData._id,
      previousStatus: null,
      newStatus: 'New',
      changedBy: req.user.id,
      note: 'Case created'
    });

    await caseData.populate('createdBy', 'name email');

    res.status(201).json({ success: true, data: caseData });
  } catch (err) {
    next(err);
  }
};

exports.assignCase = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { assignedTo } = req.body;
    const caseData = await Case.findById(req.params.id);

    if (!caseData) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    const previousStatus = caseData.status;
    caseData.assignedTo = assignedTo;
    caseData.status = 'Assigned';
    await caseData.save();

    await AuditLog.create({
      caseId: caseData._id,
      previousStatus,
      newStatus: 'Assigned',
      changedBy: req.user.id,
      note: 'Case assigned'
    });

    await caseData.populate('assignedTo', 'name email');

    res.status(200).json({ success: true, data: caseData });
  } catch (err) {
    next(err);
  }
};

exports.updateCaseStatus = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { status, note } = req.body;
    const caseData = await Case.findById(req.params.id);

    if (!caseData) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    const validTransitions = {
      'New': ['Assigned'],
      'Assigned': ['In Progress'],
      'In Progress': ['Submitted'],
      'Submitted': ['Cleared', 'Discrepant'],
      'Cleared': [],
      'Discrepant': ['In Progress']
    };

    if (!validTransitions[caseData.status].includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status transition from ${caseData.status} to ${status}` });
    }

    if (req.user.role === 'Agent') {
      if (!caseData.assignedTo || caseData.assignedTo.toString() !== req.user.id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to update this case' });
      }
      if (!['In Progress', 'Submitted'].includes(status)) {
        return res.status(403).json({ success: false, message: 'Not authorized to set this status' });
      }
    }

    if (req.user.role === 'Manager') {
      if (!['Cleared', 'Discrepant'].includes(status)) {
        return res.status(403).json({ success: false, message: 'Not authorized to set this status' });
      }
    }

    const previousStatus = caseData.status;
    caseData.status = status;
    await caseData.save();

    await AuditLog.create({
      caseId: caseData._id,
      previousStatus,
      newStatus: status,
      changedBy: req.user.id,
      note
    });

    res.status(200).json({ success: true, data: caseData });
  } catch (err) {
    next(err);
  }
};

exports.addNote = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { note } = req.body;
    const caseData = await Case.findById(req.params.id);

    if (!caseData) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    if (req.user.role === 'Agent') {
      if (!caseData.assignedTo || caseData.assignedTo.toString() !== req.user.id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to access this case' });
      }
    }

    caseData.notes.push(note);
    await caseData.save();

    res.status(200).json({ success: true, data: caseData });
  } catch (err) {
    next(err);
  }
};

exports.getAgents = async (req, res, next) => {
  try {
    const agents = await User.find({ role: 'Agent' });
    res.status(200).json({ success: true, data: agents });
  } catch (err) {
    next(err);
  }
};
