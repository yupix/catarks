import { readFileSync } from "fs";
import * as yaml from "js-yaml";

type ISentryConfig = {
  ssl: boolean;
  domain: string;
  projectId: number;
  token: string;
};

interface IConfig {
  main: {
    devMode: boolean;
    "log-level": string;
  };
  api: {
    ssl: boolean;
    domain: string;
    sentry: ISentryConfig;
  };
  client: {
    host: string;
    ssl: boolean;
  }
  db: {
    user: string;
    pass: string;
    host: string;
    port: number;
    db: string;
  };
  redis: {
    host: string;
    port: number;
    password?: string;
    db?: number;
  };
  auth: {
    secret: string;
    salt: string;
    auth0: {
      domain: string;
      clientId: string;
      secretId: string;
    };
  };
  discord: {
    token: string;
  };
  objectStorage: {
    endpoint: string;
    accessKeyId: string;
    secretAccessKey: string;
  };
}

function loadConfig() {
  const file = readFileSync(
    `${__dirname}/../../../../.config/default.yml`,
    "utf-8"
  );
  return yaml.load(file) as IConfig;
}

export const config = loadConfig();
