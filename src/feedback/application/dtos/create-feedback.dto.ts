export class CreateFeedbackDto {
  readonly studentId: string;
  readonly tutorId: string;
  readonly rate: number;
  readonly text: string;
}
