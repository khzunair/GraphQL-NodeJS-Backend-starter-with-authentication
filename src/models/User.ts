import { getModelForClass, prop, modelOptions } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { timestamps: true } })
export class User {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true, unique: true })
  public email!: string;

  @prop({ required: true, select: false })
  public password!: string;

  @prop({ enum: ["USER", "ADMIN"], default: "USER" })
  public role?: string;
}

export const UserModel = getModelForClass(User);
