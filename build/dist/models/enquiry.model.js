"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enquirySchema = new mongoose_1.default.Schema({
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
        unique: true,
        required: [true, "Email is required"],
        validate: {
            validator: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
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
            validator: (phone) => /^\+?\d{1,3}[- ]?\d{3}[- ]?\d{3}[- ]?\d{4}$/.test(phone),
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
const Enquiry = mongoose_1.default.model("Enquiry", enquirySchema);
exports.default = Enquiry;
