import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";

import { authenticator } from "~/utils/auth.server";


export let action: ActionFunction = ({ request }) => {
  return authenticator.authenticate("auth0", request);
};