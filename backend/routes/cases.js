const express = require('express');
const { body } = require('express-validator');
const {
  getCases,
  getCase,
  createCase,
  assignCase,
  updateCaseStatus,
  addNote,
  getAgents
} = require('../controllers/caseController');
const { uploadDocument, getDocuments, downloadDocument } = require('../controllers/documentController');
const { addComment, getComments } = require('../controllers/commentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getCases);
router.get('/agents', authorize('Manager'), getAgents);
router.get('/:id', getCase);
router.post('/', authorize('Manager'), [
  body('clientName').not().isEmpty().withMessage('Client name is required'),
  body('subject').not().isEmpty().withMessage('Subject is required'),
  body('caseType').not().isEmpty().withMessage('Case type is required'),
  body('dueDate').isISO8601().withMessage('Due date must be a valid date')
], createCase);
router.put('/:id/assign', authorize('Manager'), [
  body('assignedTo').not().isEmpty().withMessage('Assigned agent is required')
], assignCase);
router.put('/:id/status', [
  body('status').not().isEmpty().withMessage('Status is required')
], updateCaseStatus);
router.put('/:id/note', [
  body('note').not().isEmpty().withMessage('Note is required')
], addNote);

router.post('/:id/documents', uploadDocument);
router.get('/:id/documents', getDocuments);
router.get('/documents/:id/download', downloadDocument);

router.post('/:id/comments', [
  body('content').not().isEmpty().withMessage('Content is required')
], addComment);
router.get('/:id/comments', getComments);

module.exports = router;
