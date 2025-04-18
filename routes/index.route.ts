import express from 'express';
import { handleUpload } from '../controllers/upload.controller';
import { upload } from '../middlewares/upload.middleware';

const router = express.Router();
router.post('/upload', upload.single('audio'), handleUpload);

export default router;
