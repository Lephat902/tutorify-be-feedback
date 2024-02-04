import { GetFeedbacksByTutorIdHandler } from './get-feedbacks-by-tutor-id.handler';
import { GetFeedbackRepliesByFeedbackIdHandler } from './get-feedbacks-replies-by-feedback-id.handler';
import { GetFeedbacksHandler } from './get-feedbacks.handler';

export const QueryHandlers = [
  GetFeedbacksHandler,
  GetFeedbacksByTutorIdHandler,
  GetFeedbackRepliesByFeedbackIdHandler,
];
