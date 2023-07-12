import type { Users } from "@catarks/db";
import type { ActionArgs, TypedResponse } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { unstable_parseMultipartFormData } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import { prisma } from "~/utils/prisma.server";
import { UploaderHandler } from "~/utils/uploader-handler.server";
import { NotNullableFormData } from "~/utils/utils";
import { validateUpdateUser } from "~/validations/users/$userId";
import { commitSession, sessionStorage } from "~/utils/session.server";

export async function action({
  request,
}: ActionArgs): Promise<
  TypedResponse<
    ActionResponse<"updateProfile", Users> | ActionResponse<"?", null>
  >
> {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  const _formData = NotNullableFormData(await request.clone().formData());
  switch (request.method) {
    case "PUT": {
      const uploader = UploaderHandler(user, [
        "png",
        "gif",
        "jpeg",
        "svg",
        "webp",
        "jpg"
      ]);
      const formData = NotNullableFormData(
        await unstable_parseMultipartFormData(
          request,
          uploader.s3UploaderHandler
        )
      );
      const avatarUrl = formData.get("avatar");
      const description = _formData.get("description");
      const nickname = _formData.get("nickname");
      const body = validateUpdateUser.parse({
        avatarUrl,
        description,
        nickname,
      });
      const updatedUser = await prisma.users.update({
        where: {
          id: user.id,
        },
        data: {
          avatarUrl: body.avatarUrl,
          description: body.description,
          nickname: body.nickname,
        },
        include: { settings: true },
      });
      let session = await sessionStorage.getSession(
        request.headers.get("cookie")
      );
      session.set(authenticator.sessionKey, updatedUser);
      return redirect("/settings", {
        headers: { "Set-Cookie": await commitSession(session) },
      });
    }
  }
  return json({ intent: "?", status: "failed", body: null });
}

export type TUpdateUserAction = typeof action;
