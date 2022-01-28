// Type declarations for our environment variables
declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV?: string;
    PORT?: string;
    DATABASE_USERNAME: string;
    DATABASE_PASSWORD: string;
    DATABASE_HOST: string;
    PRIVATE_KEY: string;
    SESSION_SECRET: string;
  }
}

// Type declarations for our request object
declare namespace Express {
  export interface Request {
      userId?: string;
      username?: string;
      session: {
        browser?: string;
        user?: string;
        destroy?(fn: (err: any) => void): void;
      }
  }
}

// Type declarations for our JWT payload
declare namespace jwt {
  export interface JwtPayload {
      userId: string;
      username: string;
  }
}