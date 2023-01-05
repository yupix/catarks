import { apiClient } from "strictcat";

export const ClientAPI = apiClient<Schema>(
  "https://api.catarks.org",
  "application/json"
);
