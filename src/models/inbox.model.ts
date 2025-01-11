import mongoose, { Schema, Document } from 'mongoose';

export interface InboxDocument extends Document {
    formType: string; 
    senderName: string;
    senderEmail: string;
    subject?: string;  
    message: string;
    createdAt: Date;
}

const inboxSchema = new Schema<InboxDocument>({
    formType: {
        type: String,
        required: true,
        enum: ['Booking', 'Contact', 'Enquiry'], 
    },
    senderName: {
        type: String,
        required: true,
    },
    senderEmail: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
    },
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

});

const Inbox = mongoose.model<InboxDocument>('Inbox', inboxSchema);

export default Inbox;
