import type { Users } from "@catarks/db";
import { config } from "@catarks/shared";
import { objectStorage } from "~/utils/aws.server";
import { prisma } from "~/utils/prisma.server";

export class DriveService {
  static async deleteFileById(fileId: string, performer: Users) {
    const searchedFile = await prisma.files.findFirst({
      where: { id: fileId },
    });

    if (!searchedFile) throw new Error("file not found");
    if (searchedFile.userId !== performer.id)
      throw new Error("This file author is not you");

    const file = await prisma.files.delete({
      where: { id: fileId },
    });

    await objectStorage
      .deleteObject({
        Bucket: "catarks",
        Key: `${config.objectStorage.uploadPath}/${file.id}.${file.contentType}`,
      })
      .promise()
    return file;
  }
}
