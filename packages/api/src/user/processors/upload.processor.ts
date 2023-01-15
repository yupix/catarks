import { PrismaService } from '@/prisma.service';
import { MemoryStorageFile } from '@blazity/nest-file-fastify';
import { Users } from '@catarks/db';
import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { Job } from 'bull';
import { InjectAwsService } from 'nest-aws-sdk';
import { Md5 } from 'ts-md5';

const crypto = require('crypto');
const mime = require('mime-types');

@Injectable()
@Processor('file-upload-queue')
export class FileUploadProcessor {
  constructor(
    private prisma: PrismaService,
    @InjectAwsService(S3) private readonly s3: S3,
  ) {}

  @Process('file-upload-job')
  async processFile(job: Job) {
    const file: MemoryStorageFile = job.data.file;
    const path: string = job.data.path;
    const user: Users = job.data.user;
    console.log('test', file.mimetype, file.encoding, file.buffer);
    const hash = new Md5().appendByteArray(file.buffer).end().toString();
    const findFile = await this.prisma.files.findFirst({
      where: {
        hash,
      },
    });
    if (findFile) return findFile.url;

    const fileExtension = mime.extension(file.mimetype);
    const filename = `${crypto.randomUUID()}.${fileExtension}`;
    return this.s3
      .putObject({
        Bucket: 'ngs-market',
        Key: `${path}/${filename}`,
        Body: Buffer.from(file.buffer),
        ContentType: file.mimetype,
        ContentEncoding: file.encoding,
      })
      .promise()
      .then(async (res) => {
        await this.prisma.files.create({
          data: {
            filename,
            url: 'test',
            hash,
            author: {
              connect: {
                id: user.id,
              },
            },
          },
        });
        return 'test';
      });
  }
}
