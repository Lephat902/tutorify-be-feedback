import { IQuery } from '@nestjs/cqrs';

export class GetFeedbackRepliesByFeedbackIdQuery implements IQuery {
  constructor(public readonly feedbackId: string) {}
}
