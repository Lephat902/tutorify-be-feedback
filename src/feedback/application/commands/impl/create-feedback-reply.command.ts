import { ICommand } from '@nestjs/cqrs';
import { CreateFeedbackReplyDto } from '../../dtos';

export class CreateFeedbackReplyCommand implements ICommand {
  constructor(public readonly createFeedbackReplyDto: CreateFeedbackReplyDto) {}
}
