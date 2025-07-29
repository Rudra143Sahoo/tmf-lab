import mongoose, { Document } from 'mongoose';
export interface INote extends Document {
    title: string;
    content: string;
    user: mongoose.Types.ObjectId;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const Note: mongoose.Model<INote, {}, {}, {}, mongoose.Document<unknown, {}, INote, {}> & INote & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Note.d.ts.map