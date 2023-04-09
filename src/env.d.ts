declare namespace NodeJS {
  interface ProcessEnv {
    BASE_PATH?: string;
    CLUSTERING: string;
    DB_URL: string;
    LOG_LEVEL?: string;
    NODE_ENV: string;
    PORT: string;
    JWT_SECRET: string;
  }
}
