import dotenv from 'dotenv';
import path from 'path';
import { IEnvConfig } from './config.interface';

const dotenvConfig = dotenv.config({
    path: path.join(__dirname, '../../.env'),
})

export const envConfig = dotenvConfig.parsed as unknown as IEnvConfig;