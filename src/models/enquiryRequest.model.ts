import mongoose, { Schema, Document } from "mongoose";



export interface IEnquiryRequest extends Document {
  _id: mongoose.Types.ObjectId;
  admin?: mongoose.Types.ObjectId;
  enquiry: mongoose.Types.ObjectId;  
  requestDate: Date;
  status: string;  
  createdAt: Date;
  updatedAt: Date;
}

const enquiryRequestSchema: Schema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin", 
    },
    
    enquiry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enquiry", 
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

const EnquiryRequest = mongoose.model<IEnquiryRequest>("EnquiryRequest", enquiryRequestSchema);
export default EnquiryRequest;
