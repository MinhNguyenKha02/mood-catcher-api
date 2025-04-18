import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const convertToWavUtil = async (inputPath: string): Promise<string> => {
    const outputPath = inputPath.replace(path.extname(inputPath), '.wav');
    const cmd = `ffmpeg -y -i "${inputPath}" -ar 16000 -ac 1 -f wav "${outputPath}"`;

    await execAsync(cmd);
    return outputPath;
};