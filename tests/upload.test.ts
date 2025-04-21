import request from 'supertest';
import app from '../app'; // or wherever you export Express instance
import path from 'path';
const uploadURL = '/api/upload';

describe('POST /api/upload', () => {
    it('should transcribe a valid WAV audio file', async () => {
        const res = await request(app)
            .post(uploadURL)
            .attach('audio', path.resolve(__dirname, 'private-conversation.wav')); // ensure sample.wav is there

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('transcript');
    });

    it('should reject if no file is uploaded', async () => {
        const res = await request(app).post(uploadURL);

        expect(res.statusCode).toBe(400);
    });

    it('should reject unsupported file formats', async () => {
        const res = await request(app)
            .post(uploadURL)
            .attach('audio', path.join(__dirname, 'invalid-file.sh'));

        expect(res.statusCode).toBe(415); // if you're enforcing MIME type in controller
    });
});