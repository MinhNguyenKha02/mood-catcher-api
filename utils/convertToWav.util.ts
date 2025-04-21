import ffmpeg from 'fluent-ffmpeg';
import ffprobeStatic from 'ffprobe-static';
import ffmpegStatic from 'ffmpeg-static';
import path from 'path';

ffmpeg.setFfprobePath(ffprobeStatic.path);
ffmpeg.setFfmpegPath(ffmpegStatic as string);

export const isWavFormatValid = (filePath: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) {
                console.error('[ffprobe] Error checking format:', err);
                return resolve(false);
            }

            const audioStream = metadata.streams.find(s => s.codec_type === 'audio');
            if (!audioStream) return resolve(false);

            const codec = audioStream.codec_name;
            const sampleRate = parseInt(String(audioStream.sample_rate || 0), 10);
            const channels = parseInt(audioStream.channels?.toString() || '0', 10);

            const isValid = codec === 'pcm_s16le' && sampleRate === 16000 && channels === 1;
            resolve(isValid);
        });
    });
};

export const ensureVoskWavFormat = async (inputPath: string): Promise<string> => {
    const ext = path.extname(inputPath);
    const outputPath = inputPath.replace(ext, '.converted.wav');

    const valid = await isWavFormatValid(inputPath);
    if (valid) {
        console.log('[ffmpeg] Input file already in valid format.');
        return inputPath;
    }

    console.log('[ffmpeg] Converting to Vosk-compatible WAV...');

    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .audioChannels(1)
            .audioFrequency(16000)
            .audioCodec('pcm_s16le')
            .format('wav')
            .outputOptions('-ar', '16000') // explicitly set again
            .on('end', () => {
                console.log('[ffmpeg] Conversion complete:', outputPath);
                resolve(outputPath);
            })
            .on('error', (err) => {
                console.error('[ffmpeg] Conversion error:', err);
                reject(err);
            })
            .save(outputPath);
    });
};
