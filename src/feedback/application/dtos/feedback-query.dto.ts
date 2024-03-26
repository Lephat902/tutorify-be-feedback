import { FeedbackSortingDto, PaginationDto } from '@tutorify/shared';
import { IntersectionType } from '@nestjs/mapped-types';

export class FeedbackQueryDto extends IntersectionType(
  PaginationDto,
  FeedbackSortingDto,
) {
  readonly tutorId?: number;
  readonly q?: string;
}
