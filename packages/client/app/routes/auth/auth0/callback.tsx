import type { LoaderArgs, LoaderFunction } from "@remix-run/node";

import { authenticator } from "~/utils/auth.server";

export let loader: LoaderFunction = ({ request }: LoaderArgs) => {
  return authenticator.authenticate("auth0", request, {
    successRedirect: "/categories",
    failureRedirect: "/",
  });
};