import { readFileSync } from "fs";
import * as yaml from "js-yaml";

interface IConfig {
  main: {
    "log-level": string;
  };
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
