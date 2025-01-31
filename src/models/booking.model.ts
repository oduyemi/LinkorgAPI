import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  company: string;
  email: string;
  address: string;
  service: string;
  how: string;
  phone: string;
  state: string;
  lga: string;
  specialRequest: string;
  status: string;
  createdAt: Date;
}

const bookingSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      message: "Invalid email format",
    },
  },
  address: {
    type: String,
    required: true,
  },
  service: {
    type: String,
    required: true,
  },
  how: {
    type: String,
    required: true,
    enum: ["Search Engine", "Website", "Social Media", "Email", "Friend"],
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: (phone: string) => /^\+?\d{1,3}[- ]?\d{3}[- ]?\d{3}[- ]?\d{4}$/.test(phone),
      message: "Invalid phone number format",
    },
  },
  state: {
    type: String,
    required: true,
    enum: [
      "Abia", "Adamawa", "Akwa-Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
      "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo",
      "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
      "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers",
      "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT"
    ],
  },

  lga: {
    type: String,
    required: true,
  },

  specialRequest: {
    type: String,
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
});

const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
export default Booking;
