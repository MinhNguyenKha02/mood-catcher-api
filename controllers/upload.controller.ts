import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { recognizeSpeech } from '../services/speechTranscribe.service';
import { ensureVoskWavFormat } from '../utils/convertToWav.util';

export const handleUpload = asyncHandler(async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) throw new Error('No file uploaded');

    const wavPath = await ensureVoskWavFormat(file.path);

    console.log(wavPath)

    const audioStream = fs.createReadStream(wavPath);

    const transcript = await recognizeSpeech(audioStream);

    // Optional: clean up
    await fs.promises.unlink(file.path);
    if (wavPath !== file.path) await fs.promises.unlink(wavPath);

    res.json({ statusCode:200, transcript: transcript });
});