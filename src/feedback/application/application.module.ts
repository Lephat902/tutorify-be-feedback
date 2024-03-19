import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands/handlers';
import { QueryHandlers } from './queries/handlers';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { BroadcastModule } from '@tutorify/shared';
import { SagaModule } from 'nestjs-saga';
import { SagaHandlers } from './sagas/handlers';

@Module({
  imports: [
    InfrastructureModule,
    CqrsModule,
    BroadcastModule,
    SagaModule.register({
      imports: [ApplicationModule, BroadcastModule],
      sagas: SagaHandlers,
    }),
  ],
  controllers: [FeedbackController],
  providers: [...CommandHandlers, ...QueryHandlers, FeedbackService],
})
export class ApplicationModule {}
