import { IQuery } from '@nestjs/cqrs';

export class GetFeedbacksByTutorIdQuery implements IQuery {
  constructor(public readonly tutorId: string) {}
}
