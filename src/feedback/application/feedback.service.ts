import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetFeedbacksQuery } from './queries/impl';
import { CreateFeedbackCommand } from './commands/impl';
import { CreateFeedbackDto } from './dtos';
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
}
