import type { ActionFunction} from "@remix-run/node";

import { authenticator } from "~/utils/auth.server";


export const action: ActionFunction = ({ request }) => {
  return authenticator.authenticate("auth0", request);
};