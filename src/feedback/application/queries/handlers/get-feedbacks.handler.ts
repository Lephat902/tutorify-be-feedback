import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetFeedbacksQuery } from '../impl';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Feedback } from 'src/feedback/infrastructure/schemas';

@QueryHandler(GetFeedbacksQuery)
export class GetFeedbacksHandler implements IQueryHandler<GetFeedbacksQuery> {
  constructor(
    @InjectModel(Feedback.name) private readonly feedbackModel: Model<Feedback>,
  ) {}

  async execute(): Promise<Feedback[]> {
    return this.feedbackModel.find();
  }
}
