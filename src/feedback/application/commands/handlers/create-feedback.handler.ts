import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFeedbackCommand } from '../impl';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Feedback } from 'src/feedback/infrastructure/schemas';

@CommandHandler(CreateFeedbackCommand)
export class CreateFeedbackHandler
  implements ICommandHandler<CreateFeedbackCommand>
{
  constructor(
    @InjectModel(Feedback.name) private readonly feedbackModel: Model<Feedback>,
  ) {}

  async execute(command: CreateFeedbackCommand) {
    const { createFeedbackDto } = command;
    console.log(createFeedbackDto);
    const newFeedback = new this.feedbackModel(createFeedbackDto);
    // Save the feedback to the database
    const savedFeedback = await newFeedback.save();

    // Return the saved feedback
    return savedFeedback;
  }
}
