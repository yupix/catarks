import type { S3 } from "aws-sdk";
import { objectStorage } from "./aws.server";
import type { UploadHandler } from "@remix-run/node";
import type { Users } from "@catarks/db";
import { prisma } from "./prisma.server";
import { config } from "@catarks/shared";
import {fromBuffer} from "file-type"

const crypto = require("crypto");
const mime = require("mime-types");
const uploadStreamToS3 = async (
  file: Buffer,
  filename: string,
  contentType: string,
  author: Users
) => {
  const BUCKET_NAME = "catarks";
  const key = crypto.randomUUID();
  if (!filename) return undefined
  const hash = crypto.createHash('md5').update(file.toString()).digest('hex')
  const hitFile = await prisma.files.findFirst({where: {hash}})
  if (hitFile) return hitFile.url;
  const params: S3.PutObjectRequest = {
    Bucket: BUCKET_NAME,
    Key: `${config.objectStorage.uploadPath}/${key}.${contentType}`,
    Body: file,
    ContentType: contentType,
  };

  const url = (await objectStorage.upload(params).promise()).Location;
  await prisma.files.create({
    data: {
      id: key,
      filename,
      url,
      hash,
      contentType,
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
export const UploaderHandler = (author: Users, allowedContentTypes?: string[]) => {

  const s3UploaderHandler: UploadHandler = async ({
    data,
    filename,
  }) => {
    if (!filename) return undefined
    const file = await convertToBuffer(data)
    const _contentType = await fromBuffer(file)
    if (_contentType === undefined) {
      throw new Error('Thinking Content-Type')
    }
    if (allowedContentTypes) {
      let canUpload = false
      for (const allowedContentType of allowedContentTypes) {
        if (_contentType?.ext === allowedContentType) canUpload = true
      }
      if (!canUpload) throw Error('Not allowed Content-Type')
    }
    return await uploadStreamToS3(file, filename!, _contentType.ext, author);
  };
  return { s3UploaderHandler };
};
