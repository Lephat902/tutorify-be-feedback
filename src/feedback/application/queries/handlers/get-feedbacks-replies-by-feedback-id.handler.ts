import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetFeedbackRepliesByFeedbackIdQuery } from '../impl';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Feedback } from 'src/feedback/infrastructure/schemas';

@QueryHandler(GetFeedbackRepliesByFeedbackIdQuery)
export class GetFeedbackRepliesByFeedbackIdHandler
  implements IQueryHandler<GetFeedbackRepliesByFeedbackIdQuery>
{
  constructor(
    @InjectModel(Feedback.name)
    private readonly feedbackModel: Model<Feedback>,
  ) {}

  async execute(query: GetFeedbackRepliesByFeedbackIdQuery): Promise<Feedback> {
    const { feedbackId } = query;
    return this.feedbackModel.findById(feedbackId).populate([
      {
        path: 'replies',
        transform: (doc, id) => {
          return doc == null
            ? id
            : { id: id.toString(), ...doc._doc, _id: undefined };
        },
      },
    ]);
  }
}
