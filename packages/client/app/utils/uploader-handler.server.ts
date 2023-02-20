import type { S3 } from "aws-sdk";
import { objectStorage } from "./aws.server";
import type { UploadHandler } from "@remix-run/node";
import type { Users } from "@catarks/db";
import { prisma } from "./prisma.server";
import { config } from "@catarks/shared";
const crypto = require("crypto");
const mime = require("mime-types");
const uploadStreamToS3 = async (
  data: AsyncIterable<Uint8Array>,
  filename: string,
  contentType: string,
  author: Users
) => {
  const BUCKET_NAME = "catarks";
  const key = crypto.randomUUID();
  const file = await convertToBuffer(data)
  if (!filename) return undefined
  const hash = crypto.createHash('md5').update(file.toString()).digest('hex')
  const hitFile = await prisma.files.findFirst({where: {hash}})
  if (hitFile) return hitFile.url;
  const params: S3.PutObjectRequest = {
    Bucket: BUCKET_NAME,
    Key: `${config.objectStorage.uploadPath}/${key}.${mime.extension(contentType)}`,
    Body: file,
    ContentType: contentType,
  };

  const url = (await objectStorage.upload(params).promise()).Location;
  await prisma.files.create({
    data: {
      UUIDFilename: key,
      filename,
      url,
      hash,
      author: {connect: {id: author.id}},
    }
  })

  return url;
};

async function convertToBuffer(a: AsyncIterable<Uint8Array>) {
  const result = [];
  for await (const chunk of a) {
    result.push(chunk);
  }
  return Buffer.concat(result);
}
export const UploaderHandler = (author: Users) => {
  const s3UploaderHandler: UploadHandler = async ({
    data,
    filename,
    contentType,
  }) => {

    return await uploadStreamToS3(data, filename!, contentType, author);
  };
  return { s3UploaderHandler };
};
