import { Themes, UserSettings, Users } from "@catarks/db";
import type { ActionArgs, TypedResponse } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import { prisma } from "~/utils/prisma.server";
import { NotNullableFormData } from "~/utils/utils";
import { validateUpdateUserSettings } from "~/validations/users/$userId";
import { commitSession, sessionStorage } from "~/utils/session.server";

export async function action({
  request,
}: ActionArgs): Promise<
  TypedResponse<
    ActionResponse<"updateUserSettings", UserSettings> | ActionResponse<"?", null>
  >
> {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  const formData = NotNullableFormData(await request.clone().formData());
  switch (request.method) {
    case "PUT": {

      const defaultUseTax = formData.get("defaultUseTax");
      const useTheme = formData.get("useTheme");
      
      const body = validateUpdateUserSettings.parse({
        defaultUseTax: defaultUseTax ? defaultUseTax.toString() === 'on' : false,
        useTheme
      });
      body.useTheme = body.useTheme ? Themes[body.useTheme] : undefined
      const updatedUserSettings = await prisma.userSettings.update({
        where: {
          userId: user.id,
        },
        data: {
          defaultUseTax: body.defaultUseTax,
          useTheme: body.useTheme
        },
      });
      let session = await sessionStorage.getSession(
        request.headers.get("cookie")
      );
      user.settings = updatedUserSettings
      session.set(authenticator.sessionKey, user);
      return json({intent: 'updateUserSettings', status: 'success', body: updatedUserSettings}, {
        headers: { "Set-Cookie": await commitSession(session) },
      });
    }
  }
  return json({ intent: "?", status: "failed", body: null });
}

export type TUpdateUserSettingsAction = typeof action;
