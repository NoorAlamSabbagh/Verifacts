const Comment = require('../models/Comment');
const Case = require('../models/Case');
const { validationResult } = require('express-validator');

exports.addComment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { content } = req.body;
    const caseData = await Case.findById(req.params.id);

    if (!caseData) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    if (req.user.role === 'Agent' && caseData.assignedTo.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this case' });
    }

    const comment = await Comment.create({
      caseId: req.params.id,
      content,
      createdBy: req.user.id
    });

    await comment.populate('createdBy', 'name email');

    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
};

exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ caseId: req.params.id }).populate('createdBy', 'name email');
    res.status(200).json({ success: true, data: comments });
  } catch (err) {
    next(err);
  }
};
