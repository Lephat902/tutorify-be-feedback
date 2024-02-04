import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetFeedbacksByTutorIdQuery } from '../impl';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Feedback } from 'src/feedback/infrastructure/schemas';

@QueryHandler(GetFeedbacksByTutorIdQuery)
export class GetFeedbacksByTutorIdHandler
  implements IQueryHandler<GetFeedbacksByTutorIdQuery>
{
  constructor(
    @InjectModel(Feedback.name) private readonly feedbackModel: Model<Feedback>,
  ) {}

  async execute(query: GetFeedbacksByTutorIdQuery): Promise<Feedback[]> {
    const { tutorId } = query;
    console.log(tutorId);
    return this.feedbackModel.find({
      tutorId,
    });
  }
}
