import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type ProfileDocument = HydratedDocument<Profile>;

@Schema({ timestamps: true })
export class Profile {

  // @Prop({ required: true }) 
  // user_id: mongoose.Schema.Types.ObjectId

  @Prop({ type: Object })
  data: string;
  
  @Prop({ default: false })
  internal_message: boolean;

  @Prop({ default: false })
  push_notification: boolean;

  @Prop({ default: false })
  phone_call: boolean;

  @Prop({ default: false })
  e_mail: boolean;

  @Prop({ default: false })
  sms: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
