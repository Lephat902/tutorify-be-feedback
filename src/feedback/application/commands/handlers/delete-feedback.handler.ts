import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeleteFeedbackCommand } from '../impl';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Feedback } from 'src/feedback/infrastructure/schemas';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import {
  BroadcastService,
  FeedbackDeletedEvent,
  FeedbackDeletedEventPayload,
  UserRole
} from '@tutorify/shared';

@CommandHandler(DeleteFeedbackCommand)
export class DeleteFeedbackHandler
  implements ICommandHandler<DeleteFeedbackCommand> {
  constructor(
    @InjectModel(Feedback.name)
    private readonly feedbackModel: Model<Feedback>,
    private readonly broadcastService: BroadcastService,
  ) { }

  async execute(command: DeleteFeedbackCommand) {
    const { userMakeRequest, feedbackId } = command;
    const { userId, userRole } = userMakeRequest;

    // Find the feedback if it belongs to the user
    const feedback = await this.feedbackModel.findOne({ _id: feedbackId }).exec();

    if (!feedback) {
      throw new NotFoundException('No feedback found to delete');
    }
    
    if (userRole !== UserRole.ADMIN && userId !== UserRole.MANAGER) {
      if (feedback.userId !== userId) {
        throw new ForbiddenException('You do not have permission to delete this feedback');
      }
    }

    // Delete the feedback
    await feedback.deleteOne().exec();

    this.dispatchEvent(feedback);

    return true;
  }

  private dispatchEvent(deletedFeedback: Feedback) {
    const eventPayload = Builder<FeedbackDeletedEventPayload>()
      .feedbackId(deletedFeedback._id.toString())
      .tutorId(deletedFeedback.tutorId)
      .userId(deletedFeedback.userId)
      .rate(deletedFeedback.rate)
      .build();

    const event = new FeedbackDeletedEvent(eventPayload);

    this.broadcastService.broadcastEventToAllMicroservices(
      event.pattern,
      event.payload,
    );
  }
}
