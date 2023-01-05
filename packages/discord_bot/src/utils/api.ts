// @ts-nocheck
import { apiClient } from "strictcat";
import fetch, { Headers, Request, Response } from "node-fetch";

globalThis.Headers = Headers;
globalThis.Request = Request;
globalThis.Response = Response;
globalThis.fetch = fetch;

export const api = apiClient<Schema>("https://api.catarks.org");
