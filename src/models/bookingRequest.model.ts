import mongoose, { Schema, Document } from "mongoose";



export interface IBookingRequest extends Document {
  _id: mongoose.Types.ObjectId;
  admin: mongoose.Types.ObjectId; 
  customerName: mongoose.Types.ObjectId;  
  requestDate: Date;
  time: string;
  guestCount: number;
  status: string;  
  createdAt: Date;
  updatedAt: Date;
}

const bookingRequestSchema: Schema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin", 
      required: true,
    },
    
    customerName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",  
      required: true,
    },
    requestDate: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    guestCount: {
      type: Number,
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

const BookingRequest = mongoose.model<IBookingRequest>("BookingRequest", bookingRequestSchema);
export default BookingRequest;
