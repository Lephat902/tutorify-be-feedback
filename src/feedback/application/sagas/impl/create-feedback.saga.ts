import { ICommand } from '@nestjs/cqrs';
import { CreateFeedbackDto } from '../../dtos';

export class CreateFeedbackSaga implements ICommand {
  constructor(public readonly createFeedbackDto: CreateFeedbackDto) {}
}
