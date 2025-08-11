import { getModelForClass, prop, modelOptions, pre, DocumentType, Ref } from "@typegoose/typegoose";
import { IsEmail, IsString, MinLength, IsBoolean } from "class-validator";
import bcrypt from "bcryptjs";
import { Role } from "./Role";

@pre<User>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
})
@modelOptions({ 
  schemaOptions: { 
    timestamps: true,
    toJSON: {
      transform: function(doc: any, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      }
    }
  } 
})
export class User {
  @prop({ required: true, trim: true })
  @IsString()
  public name!: string;

  @prop({ 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true,
  })
  @IsEmail()
  public email!: string;

  @prop({ required: true, select: false })
  @IsString()
  @MinLength(6)
  public password!: string;

  @prop({ ref: () => Role, required: true })
  public role!: Ref<Role>;

  @prop({ default: true })
  @IsBoolean()
  public isActive!: boolean;

  // Timestamps
  public createdAt!: Date;
  public updatedAt!: Date;

  public async comparePassword(this: DocumentType<User>, candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

export const UserModel = getModelForClass(User);