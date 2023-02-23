import { objectStorage } from "~/utils/aws.server";
import { Queue } from "~/utils/queue.server";

const mime = require('mime-types');


type QueueData = {
  emailAddress: string;
};

export const queue = Queue<QueueData>("notifier", async (job) => {
  console.log(`Sending email to ${job.data.emailAddress}`);

  // Delay 1 second to simulate sending an email, be it for user registration, a newsletter, etc.
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log(`Email sent to ${job.data.emailAddress}`);
});

type FileQueueData = {
  path: string
  file: AsyncIterable<Uint8Array>
}

export const fileQueue = Queue<FileQueueData>('file-upload', async(job) => {
    objectStorage.upload({
    Bucket: 'ngs-market',
    Key: `${job.data.path}/${crypto.randomUUID()}`,
    Body: job.data.file
  }).promise().then((res) => {
    const url = res.Location
    const fileExtension = mime.extension()
  })
})