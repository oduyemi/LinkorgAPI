import mongoose, { Document } from "mongoose";

export interface IRetail extends Document {
  _id: mongoose.Types.ObjectId;
  fullname: string;
  company?: string;
  email: string;
  phone: string;
  address: string;
  plan: string;
  price: string;
  installation: string;
  how: string;
  note?: string;
  createdAt: Date;
}

const retailSchema = new mongoose.Schema(
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
      enum: ["Express", "Super", "Gold", "Linkorg VIP1", "Linkorg VIP2"],
    },

    price: {
      type: String,
      required: [true, "Price is required"],
    },

    installation: {
      type: String,
      required: [true, "Installation fee is required"],
    },

    how: {
      type: String,
      required: [true, "Answer the question"],
      enum: ["Search Engine", "Social Media", "LinkedIn", "Friends/Family"],
    },

    note: {
      type: String,
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


retailSchema.pre("save", function (next) {
  const planPricing = {
    Express: { price: "16020", installation: "50000" },
    Super: { price: "18500", installation: "50000" },
    Gold: { price: "30000", installation: "50000" },
    "Linkorg VIP1": { price: "60000", installation: "100000" },
    "Linkorg VIP2": { price: "80000", installation: "100000" },
  };

  const planDetails = planPricing[this.plan];
  if (planDetails) {
    this.price = planDetails.price;
    this.installation = planDetails.installation;
  }

  next();
});

const Retail = mongoose.model<IRetail>("Retail", retailSchema);
export default Retail;