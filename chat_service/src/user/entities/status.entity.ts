import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId } from "mongoose";
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Status extends Document {

  @Prop({ required: true })
  userId: mongoose.Schema.Types.ObjectId;
  
  @Prop({default: 0 }) // 0 = Offline, 1 = Online
  isOnline: number;

//   @Prop({default: 0 }) // 0 = Offline, 1 = Online
//   isTyping: number;

  @Prop()
  lastSeen: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const StatusSchema = SchemaFactory.createForClass(Status);
