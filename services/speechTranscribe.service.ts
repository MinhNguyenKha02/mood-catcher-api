// I will build a text transcription by audio file (restricted)
import fs from 'fs';
import { Model, Recognizer } from 'vosk';
import { Readable } from 'stream';
import * as path from 'path'

// Load environment variables
const MODEL_PATH = path.resolve(process.env.MODEL_PATH || '');
const SAMPLE_RATE = path.resolve(process.env.SAMPLE_RATE || '');

if (!fs.existsSync(MODEL_PATH)) {
    throw new Error(`Model path ${MODEL_PATH} does not exist`);
}

// Load model once (it's safe to reuse)
let model: Model;
try {
    model = new Model(MODEL_PATH);
    console.log('[Vosk] Model loaded successfully from:', MODEL_PATH);
} catch (err) {
    console.error('[Vosk] Failed to load model:', err);
    process.exit(1);
}

/**
 * Transcribes speech from an audio stream using Vosk.
 * Creates a new Recognizer per call (thread-safe).
 */
export const recognizeSpeech = (audioStream: Readable): Promise<string> => {
    return new Promise((resolve, reject) => {
        const recognizer = new Recognizer({ model, sampleRate: parseInt(SAMPLE_RATE) });
        let resultText = '';

        audioStream.on('data', (chunk: Buffer) => {
            if (recognizer.acceptWaveform(chunk)) {
                const result = recognizer.result();
                if (result.text) {
                    resultText += result.text + ' ';
                }
            }
        });

        audioStream.on('end', () => {
            const final = recognizer.finalResult();
            if (final.text) {
                resultText += final.text;
            }
            recognizer.free(); // clean up native memory
            console.log('[Vosk] Transcription complete:', resultText);
            resolve(resultText.trim());
        });

        audioStream.on('error', (err) => {
            recognizer.free();
            reject(err);
        });
    });
};

