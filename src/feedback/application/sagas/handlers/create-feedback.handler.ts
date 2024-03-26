import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feedback } from 'src/feedback/infrastructure/schemas';
import {
  BroadcastService,
  FeedbackCreatedEvent,
  FeedbackCreatedEventPayload,
  QueueNames,
} from '@tutorify/shared';
import { Builder as SagaBuilder, Saga } from 'nestjs-saga';
import { CreateFeedbackSaga } from '../impl';
import { Builder } from 'builder-pattern';

@Saga(CreateFeedbackSaga)
export class CreateFeedbackHandler {
  constructor(
    @InjectModel(Feedback.name) private readonly feedbackModel: Model<Feedback>,
    private readonly broadcastService: BroadcastService,
  ) {}

  private savedFeedback: Feedback;

  saga = new SagaBuilder<CreateFeedbackSaga, Feedback>()

    .step('Create the feedback')
    .invoke(this.step1)
    .withCompensation(this.step1Compensation)

    .step('Dispatch feedback-created event')
    .invoke(this.step2)

    .return(this.buildResult)
    .build();

  private async step1(command: CreateFeedbackSaga) {
    const { createFeedbackDto } = command;
    console.log(createFeedbackDto);
    const newFeedback = new this.feedbackModel(createFeedbackDto);
    // Save the feedback to the database
    const savedFeedback = await newFeedback.save();

    // Save feedback to saga
    this.savedFeedback = savedFeedback;
  }

  private async step1Compensation(cmd: CreateFeedbackSaga) {
    await this.feedbackModel.deleteOne(this.savedFeedback._id);
  }

  private step2(cmd: CreateFeedbackSaga) {
    const eventPayload = Builder<FeedbackCreatedEventPayload>()
      .feedbackId(this.savedFeedback._id.toString())
      .tutorId(this.savedFeedback.tutorId)
      .userId(this.savedFeedback.userId)
      .rate(this.savedFeedback.rate)
      .build();

    const event = new FeedbackCreatedEvent(eventPayload);

    this.broadcastService.broadcastEventToAllMicroservices(
      event.pattern,
      event.payload,
    );
  }

  private buildResult() {
    return this.savedFeedback;
  }
}
