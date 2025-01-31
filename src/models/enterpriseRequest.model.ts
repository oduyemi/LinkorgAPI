import mongoose, { Schema, Document } from "mongoose";



export interface IEnterpriseRequest extends Document {
  _id: mongoose.Types.ObjectId;
  admin: mongoose.Types.ObjectId;
  enterprise: mongoose.Types.ObjectId; 
  requestDate: Date;
  status: string;  
  createdAt: Date;
  updatedAt: Date;
}

const enterpriseRequestSchema: Schema = new mongoose.Schema(
  {
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin", 
        required: true,
    },
    
    enterprise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enterprise",  
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

const EnterpriseRequest = mongoose.model<IEnterpriseRequest>("EnterpriseRequest", enterpriseRequestSchema);
export default EnterpriseRequest;
