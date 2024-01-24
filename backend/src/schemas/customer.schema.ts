import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { ObjectId, Types } from "mongoose";

export type CustomerDocument = Customer & Document;

@Schema()
export class Customer {   
    @ApiProperty()
    _id: Types.ObjectId;
    @ApiProperty()
    @Prop()
    userId: Types.ObjectId; 
    @ApiProperty()
    @Prop()
    name: string;
    @ApiProperty()
    @Prop()
    description: string;
    @ApiProperty()
    @Prop({type : Object})
    logo: ObjectId;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
