import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// Define the additional properties for Feedback
@Schema()
export class Feedback {
  @Prop({ default: '' })
  rate: number;

  @Prop({ default: '' })
  text: string;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
