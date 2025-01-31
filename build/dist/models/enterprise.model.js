"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enterpriseSchema = new mongoose_1.default.Schema({
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
            validator: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
            message: "Invalid email format",
        },
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        validate: {
            validator: (phone) => /^\+?\d{1,3}[- ]?\d{3}[- ]?\d{3}[- ]?\d{4}$/.test(phone),
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
const Enterprise = mongoose_1.default.model("Enterprise", enterpriseSchema);
exports.default = Enterprise;
