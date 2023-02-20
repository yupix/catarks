import type { Users } from "@catarks/db";
import type { ActionArgs, TypedResponse} from "@remix-run/node";
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
  console.log(request.method);
  switch (request.method.toLowerCase()) {
    case "put": {
      const uploader = UploaderHandler(user);
      const formData = NotNullableFormData(
        await unstable_parseMultipartFormData(
          request,
          uploader.s3UploaderHandler
        )
      );
      const avatarUrl = formData.get("avatar");
      const description = formData.get("description");
      const body = validateUpdateUser.parse({ avatarUrl, description });
      const updatedUser = await prisma.users.update({
        where: {
          id: user.id,
        },
        data: {
          avatarUrl: body.avatarUrl,
          description: body.description,
        },
        include: {settings: true}
      });
      let session = await sessionStorage.getSession(
        request.headers.get("cookie")
      );
      console.log(session.data)
      session.set(authenticator.sessionKey, updatedUser);
      console.log(session.data)
      return redirect("/settings", {headers: {"Set-Cookie": await commitSession(session)}});
    }
  }
  return json({ intent: "?", status: "failed", body: null });
}

export type TUpdateUserAction = typeof action;
