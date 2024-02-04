import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  GetFeedbackRepliesByFeedbackIdQuery,
  GetFeedbacksByTutorIdQuery,
  GetFeedbacksQuery,
} from './queries/impl';
import {
  CreateFeedbackCommand,
  CreateFeedbackReplyCommand,
} from './commands/impl';
import { CreateFeedbackDto, CreateFeedbackReplyDto } from './dtos';
import { Feedback } from '../infrastructure/schemas';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  getFeedbacks(): Promise<Feedback> {
    return this.queryBus.execute(new GetFeedbacksQuery());
  }

  createFeedback(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    return this.commandBus.execute(
      new CreateFeedbackCommand(createFeedbackDto),
    );
  }

  getFeedbacksByTutorId(tutorId: string) {
    return this.queryBus.execute(new GetFeedbacksByTutorIdQuery(tutorId));
  }

  createFeedbackReply(createFeedbackReplyDto: CreateFeedbackReplyDto) {
    return this.commandBus.execute(
      new CreateFeedbackReplyCommand(createFeedbackReplyDto),
    );
  }

  getFeedbackRepliesByFeedbackId(feedbackId: string) {
    return this.queryBus.execute(
      new GetFeedbackRepliesByFeedbackIdQuery(feedbackId),
    );
  }
}
