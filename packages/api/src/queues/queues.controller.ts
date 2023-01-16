import { Controller, Get, Param } from '@nestjs/common';

@Controller('queues')
export class QueuesController {
  @Get('/:jobId')
  async getJobFromId(@Param('jobId') jobId: string) {
    jobId;
  }
}
