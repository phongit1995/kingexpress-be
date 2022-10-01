import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type SettingDocument = SettingModel & Document;
@Schema({ timestamps: true, collection: 'setting-web' })
export class SettingModel {
  @Prop({ required: true, type: Number })
  exchangeRate: number;

  @Prop({ type: String })
  address: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  urlFacebook: string;

  @Prop({ type: String })
  hotline: string;

  @Prop({ type: String })
  urlManage: string;

  @Prop({ type: Number })
  shippingRate: number;
}
export const SettingSchema = SchemaFactory.createForClass(SettingModel);
