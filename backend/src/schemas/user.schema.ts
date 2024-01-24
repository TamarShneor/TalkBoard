import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId, Types } from "mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
    _id: Types.ObjectId
    @Prop({required: true})
    name: string;
    @Prop({required: true, unique: true})
    email: string; 
    @Prop({required: true, unique: true, minlength: 8, maxlength: 13})
    password: string;
    @Prop()
    address: string;
    @Prop({maxlength: 40})
    occupation: string;
    @Prop({default: "",  maxlength: 10})
    phoneNumber: string;
    @Prop({type: Object})
    profilePicture: ObjectId;
    @Prop({default: true})
    active: boolean;    
  JSON: any;

}
export const UserSchema = SchemaFactory.createForClass(User);

