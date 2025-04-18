import fs from 'fs/promises';
import path from 'path';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { recognizeSpeech } from '../services/speechTranscribe.service';
import { convertToWavUtil } from '../utils/convertToWav.util';

export const handleUpload = asyncHandler(async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) throw new Error('No file uploaded');

    const wavPath = await convertToWavUtil(file.path);
    const stream = await fs.readFile(wavPath);
    const audioStream = new (require('stream').Readable)();
    audioStream.push(stream);
    audioStream.push(null);

    const transcript = await recognizeSpeech(audioStream);

    // Optional: clean up
    await fs.unlink(file.path);
    await fs.unlink(wavPath);

    res.json({ transcript });
});