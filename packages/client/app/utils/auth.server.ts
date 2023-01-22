import { Authenticator } from "remix-auth";
import { Auth0Strategy } from "remix-auth-auth0";

import { UserSettings, Users } from "@catarks/db";

import { sessionStorage } from "~/utils/session.server";
import { prisma } from "~/utils/prisma.server";
import { assertIsDefined } from "./utils";
import { config } from "@catarks/shared";

// Create an instance of the authenticator, pass a generic with what your
// strategies will return and will be stored in the session
export const authenticator = new Authenticator<Users & {
  settings: UserSettings | null;
}>(sessionStorage);

let auth0Strategy = new Auth0Strategy(
  {
    callbackURL: `${config.client.host}/auth/auth0/callback`,
    clientID: `${config.auth.auth0.clientId}`,
    clientSecret: `${config.auth.auth0.secretId}`,
    domain: `${config.auth.auth0.domain}`,
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    // Get the user data from your DB or API using the tokens and profile
    const findUser = await prisma.users.findFirst({
      where: {
        id: profile.id,
      },
      include: { settings: true },
    });
    assertIsDefined(profile.displayName);
    assertIsDefined(profile.photos);
    return findUser
      ? findUser
      : await prisma.users.create({
          data: {
            id: profile.id,
            username: profile.displayName,
            avatarUrl: profile.photos[0].value,
            settings: {
              create: {
                useDarkTheme: false,
              },
            },
          },
          include: { settings: true },
        });
  }
);

authenticator.use(auth0Strategy);
