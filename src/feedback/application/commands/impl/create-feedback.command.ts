import { ICommand } from '@nestjs/cqrs';
import { CreateFeedbackDto } from '../../dtos';

export class CreateFeedbackCommand implements ICommand {
  constructor(public readonly createFeedbackDto: CreateFeedbackDto) {}
}
