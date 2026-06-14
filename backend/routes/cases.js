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

/**
 * @swagger
 * /api/cases:
 *   get:
 *     summary: Get all cases
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of cases
 */
router.get('/', getCases);

/**
 * @swagger
 * /api/cases/agents:
 *   get:
 *     summary: Get all agents
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of agents
 */
router.get('/agents', authorize('Manager'), getAgents);

/**
 * @swagger
 * /api/cases/{id}:
 *   get:
 *     summary: Get single case
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Case details
 *       404:
 *         description: Case not found
 */
router.get('/:id', getCase);

/**
 * @swagger
 * /api/cases:
 *   post:
 *     summary: Create new case
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientName:
 *                 type: string
 *               subject:
 *                 type: string
 *               caseType:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Case created
 */
router.post('/', authorize('Manager'), [
  body('clientName').not().isEmpty().withMessage('Client name is required'),
  body('subject').not().isEmpty().withMessage('Subject is required'),
  body('caseType').not().isEmpty().withMessage('Case type is required'),
  body('dueDate').isISO8601().withMessage('Due date must be a valid date')
], createCase);

/**
 * @swagger
 * /api/cases/{id}/assign:
 *   put:
 *     summary: Assign case to agent
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assignedTo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Case assigned
 */
router.put('/:id/assign', authorize('Manager'), [
  body('assignedTo').not().isEmpty().withMessage('Assigned agent is required')
], assignCase);

/**
 * @swagger
 * /api/cases/{id}/status:
 *   put:
 *     summary: Update case status
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [New, Assigned, In Progress, Submitted, Cleared, Discrepant]
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated
 */
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
