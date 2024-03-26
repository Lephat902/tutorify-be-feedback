export class CreateFeedbackDto {
  readonly userId: string;
  readonly tutorId: string;
  readonly rate: number;
  readonly text: string;
}
