import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dtos';
import MongooseClassSerializerInterceptor from './interceptors/mongoose-class-serializer.interceptor';
import { Feedback } from '../infrastructure/schemas';
@Controller()
@UseInterceptors(MongooseClassSerializerInterceptor(Feedback))
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @MessagePattern({ cmd: 'getAllFeedbacks' })
  getFeedbacks(): Promise<Feedback> {
    return this.feedbackService.getFeedbacks();
  }

  @MessagePattern({ cmd: 'createFeedback' })
  createFeedback(createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.createFeedback(createFeedbackDto);
  }
}
