import { Router } from 'express';
import multer from 'multer';
import { DocumentService } from '../services/document.service';
import path from 'path';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.pdf' || ext === '.md') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Markdown files are allowed'));
    }
  },
});

// POST /api/documents/upload - Upload a document
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const title = req.body.title || req.file.originalname;
    const fileType = path.extname(req.file.originalname).toLowerCase() === '.pdf' ? 'pdf' : 'markdown';

    const docId = await DocumentService.uploadDocument(req.file.path, title, fileType);

    res.json({ id: docId, message: 'Document uploaded successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/documents - Get all documents
router.get('/', async (req, res) => {
  try {
    const documents = await DocumentService.getAllDocuments();
    res.json(documents);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/documents/:id - Delete a document
router.delete('/:id', async (req, res) => {
  try {
    const docId = parseInt(req.params.id);
    await DocumentService.deleteDocument(docId);
    res.json({ message: 'Document deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
