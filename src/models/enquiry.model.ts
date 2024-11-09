import mongoose, { Document } from "mongoose";

export interface IEnquiry extends Document {
  _id: mongoose.Types.ObjectId;
  fname: string;
  lname: string;
  email: string;
  company: string;
  address: string;
  phone: string;
  state: string;
  topic: string;
  message: string;
  createdAt: Date;
}

const enquirySchema = new mongoose.Schema({
  fname: {
    type: String,
    required: [true, "First name is required"],
  },
  lname: {
    type: String,
    required: [true, "Last name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    validate: {
      validator: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      message: "Invalid email format",
    },
  },
  company: {
    type: String,
    required: [true, "Company name is required"],
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    validate: {
      validator: (phone: string) => /^\+?\d{1,3}[- ]?\d{3}[- ]?\d{3}[- ]?\d{4}$/.test(phone),
      message: "Invalid phone number format",
    },
  },
  state: {
    type: String,
    required: [true, "State is required"],
  },
  topic: {
    type: String,
    required: [true, "Topic is required"],
  },
  message: {
    type: String,
    required: [true, "Message is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Enquiry = mongoose.model<IEnquiry>("Enquiry", enquirySchema);
export default Enquiry;
