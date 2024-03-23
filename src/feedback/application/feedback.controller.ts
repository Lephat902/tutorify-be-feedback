import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { FeedbackService } from './feedback.service';
import {
  CreateFeedbackDto,
  CreateFeedbackReplyDto,
  FeedbackQueryDto,
} from './dtos';
import MongooseClassSerializerInterceptor from './interceptors/mongoose-class-serializer.interceptor';
import { Feedback, FeedbackReply } from '../infrastructure/schemas';
@Controller()
@UseInterceptors(
  MongooseClassSerializerInterceptor(Feedback),
  MongooseClassSerializerInterceptor(FeedbackReply),
)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @MessagePattern({ cmd: 'getAllFeedbacks' })
  findFeedbacks(filters: FeedbackQueryDto) {
    return this.feedbackService.getFeedbacks(filters);
  }

  @MessagePattern({ cmd: 'createFeedback' })
  createFeedback(createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.createFeedback(createFeedbackDto);
  }

  @MessagePattern({ cmd: 'getFeedbacksByTutorId' })
  getFeedbacksByTutorId(tutorId: string) {
    return this.feedbackService.getFeedbacksByTutorId(tutorId);
  }

  @MessagePattern({ cmd: 'createFeedbackReply' })
  createFeedbackReply(createFeedbackReplyDto: CreateFeedbackReplyDto) {
    return this.feedbackService.createFeedbackReply(createFeedbackReplyDto);
  }

  @MessagePattern({ cmd: 'getFeedbackRepliesByFeedback' })
  getFeedbackRepliesByFeedback(feedbackId: string) {
    return this.feedbackService.getFeedbackRepliesByFeedbackId(feedbackId);
  }
}
