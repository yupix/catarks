import { apiClient } from "strictcat";
import type { Schema } from "./api";

export const api = apiClient<Schema>("http://localhost:3000")

export const HTTP_ERRORS = new Map<string, { content: string }>([
  ["400", { content: "Bad Request" }],
  ["401", { content: "Unauthorized" }],
  ["402", { content: "Payment Required " }],
  ["403", { content: "Forbidden" }],
  ["404", { content: "Not Found" }],
  ["405", { content: "Method Not Allowed" }],
  ["406", { content: "Not Acceptable" }],
  ["407", { content: "Proxy Authentication Required" }],
  ["500", { content: "Internal Server Error", }],
  ["501", { content: "Not Implemented", }],
  ["502", { content: "Bad Gateway" }]
]
)

export const getPaginationPageNumber = (options: {page: string | number, limit: number}) => {
  return options.page === '0' || options.page === '1' ? 0 : options.limit * (Number(options.page) - 1)
}