import mongoose, { Schema, Document } from "mongoose";



export interface IRetailRequest extends Document {
  _id: mongoose.Types.ObjectId;
  admin?: mongoose.Types.ObjectId;
  formID: mongoose.Types.ObjectId;  
  requestDate: Date;
  status: string; 
  createdAt: Date;
  updatedAt: Date;
}

const retailRequestSchema: Schema = new mongoose.Schema(
  {
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin", 
    },
    formID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Retail", 
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

const RetailRequest = mongoose.model<IRetailRequest>("RetailRequest", retailRequestSchema);
export default RetailRequest;
