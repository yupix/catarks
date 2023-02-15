import { config } from "@catarks/shared"
import MeiliSearch from "meilisearch"

export const SearchClient = new MeiliSearch({host: config.meilisearch.host, apiKey: config.meilisearch.apikey})
