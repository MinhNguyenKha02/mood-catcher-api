// middlewares/upload.middleware.ts
import multer, {FileFilterCallback} from 'multer';
import {Request, Response, NextFunction} from "express";
import path from 'path';
import { randomUUID } from 'crypto';
import {HttpError} from "../utils/errors/httpError.error";

const allowedTypes = ['audio/wav', 'audio/wave', 'audio/x-wav', 'audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/ogg', 'audio/webm'];

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, 'storage/uploads/'),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${randomUUID()}${ext}`);
    },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb:FileFilterCallback ) => {
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new HttpError(415,'Unsupported file type'));
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max
    },
});


export const ensureFileUploaded = (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
        return next(new HttpError(400, 'No audio file uploaded.'));
    }
    next();
};
