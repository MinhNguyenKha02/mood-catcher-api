import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const isWavFormatValid = async (filePath: string): Promise<boolean> => {
    try {
        const cmd = `ffprobe -v error -select_streams a:0 -show_entries stream=codec_name,sample_rate,channels -of default=noprint_wrappers=1 "${filePath}"`;
        const { stdout } = await execAsync(cmd);

        const codec = /codec_name=(\w+)/.exec(stdout)?.[1];
        const sampleRate = parseInt(/sample_rate=(\d+)/.exec(stdout)?.[1] || '0', 10);
        const channels = parseInt(/channels=(\d+)/.exec(stdout)?.[1] || '0', 10);

        return codec === 'pcm_s16le' && sampleRate === 16000 && channels === 1;
    } catch (error) {
        console.error('Failed to check WAV format:', error);
        return false;
    }
};

export const ensureVoskWavFormat = async (inputPath: string): Promise<string> => {
    const valid = await isWavFormatValid(inputPath);

    if (valid) {
        return inputPath;
    }

    const outputPath = inputPath.replace(path.extname(inputPath), '.converted.wav');
    const cmd = `ffmpeg -y -i "${inputPath}" -ar 16000 -ac 1 -acodec pcm_s16le -f wav "${outputPath}"`;

    await execAsync(cmd);
    return outputPath;
};