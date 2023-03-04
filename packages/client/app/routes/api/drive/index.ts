import type { Files } from "@catarks/db";
import type { ActionArgs } from "@remix-run/node";
import type { TypedJsonResponse} from "remix-typedjson";
import { typedjson } from "remix-typedjson";
import { DriveService } from "~/services/drive.service";
import { authenticator } from "~/utils/auth.server";
import { NotNullableFormData } from "~/utils/utils";

export type TDriveAction = typeof action

export async function action({
  request,
}: ActionArgs): Promise<
  TypedJsonResponse<
    ActionResponse<"deleteFile", Files> | ActionResponse<"?", undefined>
  >
> {
  const user = await authenticator.isAuthenticated(request);
  if (!user) throw new Error("403 Forbidden");
  const formData = NotNullableFormData(await request.clone().formData());
  switch (request.method.toLowerCase()) {
    case "delete": {
      // TODO: validationを追加
      const fileId = formData.get("fileId");
      const deletedFile = await DriveService.deleteFileById(fileId!.toString(), user)
      return typedjson({ intent: "deleteFile", body: deletedFile, status: "success" });
    }
  }
  return typedjson({ intent: "?", body: undefined, status: "success" });
}
