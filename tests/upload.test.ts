import request from 'supertest';
import app from '../app'; // or wherever you export Express instance
import path from 'path';

describe('POST /upload', () => {
    it('should transcribe a valid WAV audio file', async () => {
        const res = await request(app)
            .post('/upload')
            .attach('audio', path.join(__dirname, 'sample.wav')); // ensure sample.wav is there

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('text');
        expect(typeof res.body.text).toBe('string');
    });

    it('should reject if no file is uploaded', async () => {
        const res = await request(app).post('/upload');

        expect(res.statusCode).toBe(400);
    });

    it('should reject unsupported file formats', async () => {
        const res = await request(app)
            .post('/upload')
            .attach('audio', path.join(__dirname, 'sample.mp3'));

        expect(res.statusCode).toBe(415); // if you're enforcing MIME type in controller
    });
});