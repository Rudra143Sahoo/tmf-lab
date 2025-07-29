import { Types } from 'mongoose';
export interface JWTPayload {
    userId: string;
    email: string;
}
export declare const generateToken: (userId: Types.ObjectId, email: string) => string;
export declare const verifyToken: (token: string) => JWTPayload;
//# sourceMappingURL=jwt.d.ts.map