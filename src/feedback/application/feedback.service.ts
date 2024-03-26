import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  GetFeedbackRepliesByFeedbackIdQuery,
  GetFeedbacksByTutorIdQuery,
  GetFeedbacksQuery,
} from './queries/impl';
import { CreateFeedbackReplyCommand } from './commands/impl';
import {
  CreateFeedbackDto,
  CreateFeedbackReplyDto,
  FeedbackQueryDto,
} from './dtos';
import { Feedback, FeedbackReply } from '../infrastructure/schemas';
import {
  BroadcastService,
  FeedbackCreatedEvent,
  FeedbackCreatedEventPayload,
  FeedbackReplyCreatedEvent,
  FeedbackReplyCreatedEventPayload,
} from '@tutorify/shared';
import { Builder } from 'builder-pattern';
import { CreateFeedbackSaga } from './sagas/impl';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly broadcastService: BroadcastService,
  ) {}

  getFeedbacks(filters: FeedbackQueryDto) {
    return this.queryBus.execute(new GetFeedbacksQuery(filters));
  }

  async createFeedback(
    createFeedbackDto: CreateFeedbackDto,
  ): Promise<Feedback> {
    return this.commandBus.execute(new CreateFeedbackSaga(createFeedbackDto));
  }

  getFeedbacksByTutorId(tutorId: string) {
    return this.queryBus.execute(new GetFeedbacksByTutorIdQuery(tutorId));
  }

  async createFeedbackReply(
    createFeedbackReplyDto: CreateFeedbackReplyDto,
  ): Promise<FeedbackReply> {
    const newFeedbackReply = await this.commandBus.execute(
      new CreateFeedbackReplyCommand(createFeedbackReplyDto),
    );

    this.dispatchFeedbackReplyCreatedEvent(
      createFeedbackReplyDto.feedbackId,
      newFeedbackReply,
    );

    return newFeedbackReply;
  }

  getFeedbackRepliesByFeedbackId(feedbackId: string) {
    return this.queryBus.execute(
      new GetFeedbackRepliesByFeedbackIdQuery(feedbackId),
    );
  }

  async dispatchFeedbackCreatedEvent(newFeedback: Feedback) {
    const { _id, userId, tutorId, rate } = newFeedback;
    const eventPayload = Builder<FeedbackCreatedEventPayload>()
      .feedbackId(_id.toString())
      .userId(userId)
      .tutorId(tutorId)
      .rate(rate)
      .build();
    const event = new FeedbackCreatedEvent(eventPayload);
    this.broadcastService.broadcastEventToAllMicroservices(
      event.pattern,
      event.payload,
    );
  }

  async dispatchFeedbackReplyCreatedEvent(
    feedbackId: string,
    newFeedbackReply: FeedbackReply,
  ) {
    const { _id, userId } = newFeedbackReply;
    const eventPayload = Builder<FeedbackReplyCreatedEventPayload>()
      .feedbackReplyId(_id.toString())
      .userId(userId)
      .feedbackId(feedbackId)
      .build();
    const event = new FeedbackReplyCreatedEvent(eventPayload);
    this.broadcastService.broadcastEventToAllMicroservices(
      event.pattern,
      event.payload,
    );
  }
}
