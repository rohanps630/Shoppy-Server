import * as dotenv from 'dotenv';
dotenv.config();

export class Environment {
  private static envFileName: string;

  private constructor() {}

  public static getEnvFileName(): string {
    if (Environment.envFileName) return Environment.envFileName;

    const nodeEnv = process.env.NODE_ENV;
    let fileName = '.env';

    if (nodeEnv === 'development') {
      fileName = '.env.development';
    } else if (nodeEnv === 'production') {
      fileName = '.env.production';
    } else if (nodeEnv === 'staging') {
      fileName = '.env.staging';
    }

    Environment.envFileName = fileName;
    return fileName;
  }

  public static loadEnv() {
    const fileName = Environment.getEnvFileName();

    dotenv.config({
      path: fileName,
    });

    console.log(`Loaded environment variables from ${fileName}`);
  }
}
