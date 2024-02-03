import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [
    FeedbackModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.example'],
    }),
  ],
})
export class AppModule {}
