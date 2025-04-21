import express from 'express';
import { handleUpload } from '../controllers/upload.controller';
import { upload, ensureFileUploaded } from '../middlewares/upload.middleware';

const router = express.Router();
router.post('/upload', upload.single('audio'), ensureFileUploaded, handleUpload);

export default router;
