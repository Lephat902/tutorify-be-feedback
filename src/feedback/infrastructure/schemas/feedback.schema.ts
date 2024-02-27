import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose, Transform } from 'class-transformer';
import { Schema as MongooseSchema } from 'mongoose';
import { FeedbackReply } from './feedback-reply.schema';

// Define the additional properties for Feedback
@Schema({ timestamps: true })
export class Feedback {
  @Expose({ name: 'id' })
  @Transform((params) => params.obj._id.toString())
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  rate: number;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  tutorId: string;

  @Prop({ required: true })
  studentId: string;

  @Prop([
    {
      type: MongooseSchema.Types.ObjectId,
      ref: FeedbackReply.name,
    },
  ])
  replies: MongooseSchema.Types.ObjectId[];
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
