import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    isEmailVerified: boolean;
    authProvider: 'email' | 'google';
    googleId?: string;
    avatar?: string;
    otp?: string;
    otpExpires?: Date;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=User.d.ts.map