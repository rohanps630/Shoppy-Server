import * as dotenv from 'dotenv';
dotenv.config();

export class ENV {
  private static envFile: string | null = null;

  private constructor() {}

  public static envFileName(): string[] {
    if (ENV.envFile !== null) return [ENV.envFile];

    const nodeEnv = process.env.NODE_ENV;

    if (nodeEnv === 'development') {
      ENV.envFile = '.env.development';
    } else if (nodeEnv === 'production') {
      ENV.envFile = '.env.production';
    } else if (nodeEnv === 'staging') {
      ENV.envFile = '.env.staging';
    } else {
      // Default to '.env' if NODE_ENV is not set or doesn't match known values
      ENV.envFile = '.env';
    }

    return [ENV.envFile];
  }
}
