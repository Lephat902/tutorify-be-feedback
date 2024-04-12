import { ICommand } from '@nestjs/cqrs';
import { UserMakeRequest } from '@tutorify/shared';

export class DeleteFeedbackCommand implements ICommand {
  constructor(
    public readonly userMakeRequest: UserMakeRequest,
    public readonly feedbackId: string
  ) { }
}
