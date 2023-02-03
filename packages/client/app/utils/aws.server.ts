import { config } from "@catarks/shared";
import AWS from "aws-sdk"

export const objectStorage = new AWS.S3({
  endpoint: config.objectStorage.endpoint,
  s3ForcePathStyle: true,
  credentials: {
    accessKeyId: config.objectStorage.accessKeyId,
    secretAccessKey: config.objectStorage.secretAccessKey,
  }
})