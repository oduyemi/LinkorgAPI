import mongoose, { Schema, Document } from "mongoose";

export interface IContactRequest extends Document {
  _id: mongoose.Types.ObjectId;
  admin: mongoose.Types.ObjectId; 
  contact: mongoose.Types.ObjectId; 
  requestDate: Date;
  status: string;  
  createdAt: Date;
  updatedAt: Date;
}

const contactRequestSchema: Schema = new mongoose.Schema(
  {
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin", 
        required: true,
    },
    
    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
      required: true,
    },
    requestDate: {
      type: Date,
      required: true,
    },
    status: {
        type: String,
        enum: ["pending", "working", "resolved", "rejected"],
        required: true,
        default: "pending",
      },

    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const ContactRequest = mongoose.model<IContactRequest>("ContactRequest", contactRequestSchema);
export default ContactRequest;
