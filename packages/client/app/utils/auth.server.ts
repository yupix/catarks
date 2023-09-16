import { Authenticator } from "remix-auth";
import { Auth0Strategy } from "remix-auth-auth0";
import { sessionStorage } from "~/utils/session.server";
import { prisma } from "~/utils/prisma.server";
import { assertIsDefined } from "./utils";
import { config } from "@catarks/shared";
import { TUserSession } from "~/const";

// Create an instance of the authenticator, pass a generic with what your
// strategies will return and will be stored in the session
export const authenticator = new Authenticator<TUserSession>(sessionStorage);

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
        auth0Id: profile.id,
      },
      include: { settings: true, role: true, UserShortCut: true },
    });
    const username = profile._json?.nickname ? profile._json?.nickname : profile.displayName
    assertIsDefined(profile.photos);
    assertIsDefined(profile.id);
    assertIsDefined(username);
    return findUser
      ? {user: findUser}
      : {user: await prisma.users.create({
          data: {
            auth0Id: profile.id,
            username,
            avatarUrl: profile.photos[0].value,
            settings: {
              create: {
                useTheme: "winter",
                defaultUseTax: false
              },
            },
          },
          include: { settings: true, role: true, UserShortCut: true },
        })};
  }
);

authenticator.use(auth0Strategy);
