const Document = require('../models/Document');
const Case = require('../models/Case');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

exports.uploadDocument = [
  upload.single('file'),
  async (req, res, next) => {
    try {
      const caseData = await Case.findById(req.params.id);

      if (!caseData) {
        return res.status(404).json({ success: false, message: 'Case not found' });
      }

      if (req.user.role === 'Agent') {
        if (!caseData.assignedTo || caseData.assignedTo.toString() !== req.user.id.toString()) {
          return res.status(403).json({ success: false, message: 'Not authorized to access this case' });
        }
      }

      const document = await Document.create({
        caseId: req.params.id,
        fileName: req.file.originalname,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        uploadedBy: req.user.id
      });

      await document.populate('uploadedBy', 'name email');

      res.status(201).json({ success: true, data: document });
    } catch (err) {
      next(err);
    }
  }
];

exports.getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find({ caseId: req.params.id }).populate('uploadedBy', 'name email');
    res.status(200).json({ success: true, data: documents });
  } catch (err) {
    next(err);
  }
};

exports.downloadDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    res.download(document.filePath, document.fileName);
  } catch (err) {
    next(err);
  }
};
