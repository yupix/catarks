import type { ActionFunction } from "@remix-run/node";
import { unstable_parseMultipartFormData } from "@remix-run/node";
import { UploaderHandler } from "~/utils/uploader-handler.server";
import { authenticator } from "~/utils/auth.server";


export const action: ActionFunction = async ({ request }) => {
  
  const user = await authenticator.isAuthenticated(request, {failureRedirect: '/'})
  const uploader = UploaderHandler(user)
  const formData = await unstable_parseMultipartFormData(request, uploader.s3UploaderHandler);
  
  const url = formData.get('upload');
  
  return {
    url,
  }
}
export const uploadAction = typeof action