import mongoose, { Schema, Document } from "mongoose";

export interface IEmail extends Document {
    email: string;
    subject: string;
    name: string;
    message: string;
    sentAt: Date;
}

const EmailSchema: Schema = new Schema({
    email: { type: String, required: true },
    subject: { type: String, required: true },
    name: { type: String, required: true },
    message: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
});

const Email = mongoose.model<IEmail>("Email", EmailSchema);

export default Email;
