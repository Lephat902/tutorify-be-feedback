import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Feedback,
  FeedbackReply,
  FeedbackReplySchema,
  FeedbackSchema,
} from './schemas';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      // without useFactory and async, SECRET cannot be read by configService
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: Feedback.name,
        schema: FeedbackSchema,
      },
      {
        name: FeedbackReply.name,
        schema: FeedbackReplySchema,
      },
    ]),
  ],
  providers: [MongooseModule, Feedback, FeedbackReply],
  exports: [MongooseModule, Feedback, FeedbackReply],
})
export class InfrastructureModule {}
