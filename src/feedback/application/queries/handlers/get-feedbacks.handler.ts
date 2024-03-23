import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetFeedbacksQuery } from '../impl';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Feedback } from 'src/feedback/infrastructure/schemas';
import { SortingDirection } from '@tutorify/shared';

@QueryHandler(GetFeedbacksQuery)
export class GetFeedbacksHandler implements IQueryHandler<GetFeedbacksQuery> {
  constructor(
    @InjectModel(Feedback.name) private readonly feedbackModel: Model<Feedback>,
  ) {}

  async execute(query: GetFeedbacksQuery) {
    const { filters } = query;
    const { tutorId, page, limit, sort, dir } = filters;
    const feedbacksPromise = this.feedbackModel
      .find(
        tutorId
          ? {
              tutorId,
            }
          : {},
      )
      .select('-replies')
      .setOptions({
        skip: (page - 1) * limit,
        limit,
      })
      .sort([[sort, dir == SortingDirection.ASC ? 'asc' : 'desc']])
      .exec();

    const totalCountPromise = this.feedbackModel
      .countDocuments(
        tutorId
          ? {
              tutorId,
            }
          : {},
      )
      .exec();

    const [results, totalCount] = await Promise.all([
      feedbacksPromise,
      totalCountPromise,
    ]);
    return { results, totalCount };
  }
}
