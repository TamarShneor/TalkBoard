import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type CategotyDocument = Category & Document;

@Schema()
export class Category {
    _id: Types.ObjectId
    @Prop({required: true})
    name: string;  

}
export const CategorySchema = SchemaFactory.createForClass(Category);