// I will build a text transcription by audio file (restricted)
import fs from 'fs';
import { Model, Recognizer } from 'vosk';
import { Readable } from 'stream';
import * as path from 'path'

// Load environment variables
const MODEL_PATH = path.resolve(process.env.MODEL_PATH || '');
const SAMPLE_RATE = parseInt(process.env.SAMPLE_RATE || '16000', 10);

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
        const recognizer = new Recognizer({ model, sampleRate: SAMPLE_RATE });
        let resultText = '';

        const bufferSize = 4000;
        let leftover = Buffer.alloc(0);

        audioStream.on('data', (chunk: Buffer) => {
            const combined = Buffer.concat([leftover, chunk]);

            let offset = 0;
            while (offset + bufferSize <= combined.length) {


                const piece = combined.slice(offset, offset + bufferSize);

                // 🔐 Safety: must be even number of bytes (1 frame = 2 bytes)
                if (piece.length % 2 !== 0) {
                    leftover = combined.slice(offset); // save for next round
                    break; // skip malformed chunk
                }

                try {
                    console.log('[Vosk] Chunk length:', piece.length);
                    if (recognizer.acceptWaveform(piece)) {
                        const result = recognizer.result();
                        if (result.text) {
                            resultText += result.text + ' ';
                        }
                    }
                } catch (err) {
                    console.error('[Vosk] acceptWaveform error:', err);
                    recognizer.free();
                    return reject(err); // hard crash-safe
                }

                offset += bufferSize;
            }

            leftover = combined.slice(offset);
        });

        audioStream.on('end', () => {
            if (leftover.length > 0 && leftover.length % 2 === 0) {
                recognizer.acceptWaveform(leftover);
            }
            const final = recognizer.finalResult();
            if (final.text) {
                resultText += final.text;
            }
            recognizer.free();
            console.log('[Vosk] Transcription complete:', resultText);
            resolve(resultText.trim());
        });

        audioStream.on('error', (err) => {
            recognizer.free();
            reject(err);
        });
    });
};

