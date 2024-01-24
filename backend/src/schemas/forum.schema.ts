import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";
import { Category } from "./category.schema";

export type ForumDocument = Forum & Document;


@Schema()
export class Forum {
    _id: Types.ObjectId
    @Prop({required: true})
    admin: Types.ObjectId;
    @Prop({required: true})
    subject: string;
    @Prop()
    isPublic: boolean;
    @Prop()
    lastEdited: Date;
    @Prop({required: true, unique:true})
    password: string;
    @Prop()
    description: string;
    @Prop()
    usersList: Array<string>;
    @Prop()
    categoriesList: Array<Category>

}

export const ForumSchema = SchemaFactory.createForClass(Forum);

