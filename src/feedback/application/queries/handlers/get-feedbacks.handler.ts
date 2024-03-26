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
    const { tutorId, page, limit, sort, dir, q } = filters;
    const filterObject = {};

    if (tutorId) {
      filterObject['tutorId'] = tutorId;
    }

    if (q != null && q != undefined) {
      filterObject['text'] = { $regex: new RegExp(`${q}`, 'i') };
    }

    const feedbacksPromise = this.feedbackModel
      .find(filterObject)
      .select('-replies')
      .setOptions(
        limit && page
          ? {
              skip: (page - 1) * limit,
              limit,
            }
          : {
              skip: 0,
              limit: 10,
            },
      )
      .sort([[sort, dir == SortingDirection.ASC ? 'asc' : 'desc']])
      .exec();

    const totalCountPromise = this.feedbackModel
      .countDocuments(filterObject)
      .exec();

    const [results, totalCount] = await Promise.all([
      feedbacksPromise,
      totalCountPromise,
    ]);
    return { results, totalCount };
  }
}
