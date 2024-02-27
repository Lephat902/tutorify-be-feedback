import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands/handlers';
import { QueryHandlers } from './queries/handlers';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { BroadcastModule } from '@tutorify/shared';

@Module({
  imports: [
    InfrastructureModule,
    CqrsModule,
    BroadcastModule,
  ],
  controllers: [FeedbackController],
  providers: [...CommandHandlers, ...QueryHandlers, FeedbackService],
})
export class ApplicationModule { }
