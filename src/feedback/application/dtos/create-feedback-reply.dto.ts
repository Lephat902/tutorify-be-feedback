export class FeedbackReplyDto {
  readonly userId: string;
  readonly text: string;
}

export class CreateFeedbackReplyDto {
  readonly feedbackId: string;
  readonly feedbackReply: FeedbackReplyDto;
}