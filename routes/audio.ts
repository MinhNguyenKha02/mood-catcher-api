// I will build upload api here gate of mood catcher
import fs from 'fs';
import { Model, Recognizer } from 'vosk';
import { Readable } from 'stream';

const MODEL_PATH = process.env.MODEL_PATH;
const SAMPLE_RATE =process.env.SAMPLE_RATE;
if (!MODEL_PATH || !SAMPLE_RATE) {
    throw new Error('MODEL_PATH is not defined in .env');
}

let model: Model;
try {
    model = new Model(MODEL_PATH);
} catch (err) {
    console.error('Failed to load Vosk model:', err);
    process.exit(1);
}


