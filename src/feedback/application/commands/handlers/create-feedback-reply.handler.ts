import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CreateFeedbackReplyCommand } from '../impl';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Feedback, FeedbackReply } from 'src/feedback/infrastructure/schemas';

@CommandHandler(CreateFeedbackReplyCommand)
export class CreateFeedbackReplyHandler
  implements ICommandHandler<CreateFeedbackReplyCommand>
{
  constructor(
    @InjectModel(Feedback.name)
    private readonly feedbackModel: Model<Feedback>,
    @InjectModel(FeedbackReply.name)
    private readonly feedbackReplyModel: Model<FeedbackReply>,
    @InjectConnection() private readonly connection: Connection,
  ) { }

  async execute(command: CreateFeedbackReplyCommand) {
    const session = await this.connection.startSession();
    const repliedFeedback = await session.withTransaction(async () => {
      const { createFeedbackReplyDto } = command;
      const { feedbackId, feedbackReply } = createFeedbackReplyDto;

      const newReply = new this.feedbackReplyModel(feedbackReply);
      // Save the feedback reply to the database
      const savedReply = await newReply.save();

      // Update the replied feedback to the database
      const repliedFeedback = await this.feedbackModel
        .findByIdAndUpdate(
          feedbackId,
          {
            $push: {
              replies: savedReply.id,
            },
          },
          { new: true, useFindAndModify: false, timestamps: false },
        )
        .populate([
          {
            path: 'replies',
            transform: (doc, id) => {
              return doc == null
                ? id
                : { id: id.toString(), ...doc._doc, _id: undefined };
            },
          },
        ]);

      // Return the saved feedback
      return repliedFeedback;
    });
    session.endSession();

    return repliedFeedback;
  }
}
