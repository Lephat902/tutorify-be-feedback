import { IQuery } from '@nestjs/cqrs';
import { FeedbackQueryDto } from '../../dtos';

export class GetFeedbacksQuery implements IQuery {
  constructor(public readonly filters: FeedbackQueryDto) {}
}
