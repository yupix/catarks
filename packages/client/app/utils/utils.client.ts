import { CREATE_URL, config } from "@catarks/shared";
import { apiClient } from "strictcat";

export const ClientAPI = apiClient<Schema>(
  CREATE_URL(config.api.domain, config.api.ssl),
  {
    contentType: "application/json",
  }
);
