export class FeedbackReply {
  readonly studentId: string;
  readonly text: string;
}

export class CreateFeedbackReplyDto {
  readonly feedbackId: string;
  readonly feedbackReply: FeedbackReply;
}
