import { getModelForClass, prop, modelOptions, pre, DocumentType } from "@typegoose/typegoose";
import bcrypt from "bcryptjs";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

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
        delete ret.password;
        return ret;
      }
    }
  } 
})
export class User {
  @prop({ required: true, trim: true })
  public name!: string;

  @prop({ 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true,
    validate: {
      validator: function(email: string) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
      },
      message: 'Please enter a valid email'
    }
  })
  public email!: string;

  @prop({ 
    required: true, 
    select: false,
    minlength: [6, 'Password must be at least 6 characters long']
  })
  public password!: string;

  @prop({ enum: UserRole, default: UserRole.USER })
  public role?: UserRole;

  @prop({ default: Date.now })
  public lastLogin?: Date;

  @prop({ default: true })
  public isActive!: boolean;

  // Method to compare password
  public async comparePassword(this: DocumentType<User>, candidatePassword: string): Promise<boolean> {
    // Need to explicitly select password for comparison
    const userWithPassword = await UserModel.findById(this.id).select('+password');
    if (!userWithPassword) return false;
    return bcrypt.compare(candidatePassword, userWithPassword.password);
  }

  // Method to update last login
  public async updateLastLogin(this: DocumentType<User>): Promise<void> {
    this.lastLogin = new Date();
    await this.save();
  }
}

export const UserModel = getModelForClass(User);
