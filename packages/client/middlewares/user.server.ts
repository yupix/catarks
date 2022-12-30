import { api } from "~/utils/utils";

export async function getUserProfile(cookie: TUserSession) {
  const res = await api.call("GET", "/api/users/whoami", {
    headers: new Headers({
      Cookie: cookie.session,
      "Content-Type": "text/plain",
    }),
  });
  if (res.type === "failed") {
    throw new Error(JSON.stringify(res.data));
  }
  return res.data;
}
