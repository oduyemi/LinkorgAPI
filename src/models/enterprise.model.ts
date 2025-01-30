import mongoose, { Document } from "mongoose";

export interface IEnterprise extends Document {
  _id: mongoose.Types.ObjectId;
  fullname: string;
  company?: string;
  email: string;
  phone: string;
  contact?: string;
  contact_job?: string;
  address: string;
  plan: string;
  how: string;
  status: string;
  createdAt: Date;
}

const enterpriseSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Full name is required"],
    },

    company: {
      type: String,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      validate: {
        validator: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        message: "Invalid email format",
      },
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: (phone: string) => /^\+?\d{1,3}[- ]?\d{3}[- ]?\d{3}[- ]?\d{4}$/.test(phone),
        message: "Invalid phone number format",
      },
    },

    address: {
      type: String,
      required: [true, "Address is required"],
    },

    plan: {
      type: String,
      required: [true, "Plan is required"],
      enum: ["Fiber to Home", "Fiber to Office", "Estate Connect", "Wireless Connectivity"],
    },

    note: {
      type: String,
    },

    how: {
      type: String,
      required: [true, "Answer the question"],
      enum: ["Search Engine", "Social Media", "LinkedIn", "Friends/Family"],
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
  },
  {
    timestamps: true,
  }
);

const Enterprise = mongoose.model<IEnterprise>("Enterprise", enterpriseSchema);
export default Enterprise;
