import { getModelForClass, prop, modelOptions } from "@typegoose/typegoose";
import { IsString, IsOptional, IsArray, IsBoolean, IsNumber } from "class-validator";

export enum RoleType {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  MANAGER = "MANAGER", 
  USER = "USER",
  GUEST = "GUEST"
}

@modelOptions({ 
  schemaOptions: { 
    timestamps: true,
    toJSON: {
      transform: function(doc: any, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  } 
})
export class Role {
  @prop({ required: true, unique: true, trim: true, uppercase: true })
  @IsString()
  public name!: string;

  @prop({ required: true, trim: true })
  @IsString()
  public displayName!: string;

  @prop({ trim: true })
  @IsOptional()
  @IsString()
  public description?: string;

  @prop({ type: [String], default: [] })
  @IsArray()
  public permissions!: string[];

  @prop({ default: true })
  @IsBoolean()
  public isActive!: boolean;

  @prop({ default: 1 })
  @IsNumber()
  public priority!: number;

  // Timestamps
  public createdAt!: Date;
  public updatedAt!: Date;
}

export const RoleModel = getModelForClass(Role);