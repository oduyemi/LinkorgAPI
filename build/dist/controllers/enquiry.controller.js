"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newEnquiry = exports.getEnquiryById = exports.getAllEnquiries = void 0;
const enquiry_model_1 = __importDefault(require("../models/enquiry.model"));
const getAllEnquiries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const enquiries = yield enquiry_model_1.default.find();
        res.status(200).json(enquiries);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving enquiries", error: error.message });
    }
});
exports.getAllEnquiries = getAllEnquiries;
const getEnquiryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const enquiry = yield enquiry_model_1.default.findById(id);
        if (!enquiry) {
            res.status(404).json({ message: "Enquiry not found" });
            return;
        }
        res.status(200).json(enquiry);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving enquiry", error: error.message });
    }
});
exports.getEnquiryById = getEnquiryById;
const newEnquiry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, lname, email, company, address, phone, state, topic, message } = req.body;
        if (![name, lname, email, company, address, phone, state, topic, message].every(field => field)) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        const addEnquiry = new enquiry_model_1.default({ name, lname, email, company, address, phone, state, topic, message });
        yield addEnquiry.save();
        res.status(201).json({ message: "New enquiry form added successfully" });
    }
    catch (error) {
        console.error("Error during enquiry data creation:", error);
        res.status(500).json({ message: "Error creating enquiry data" });
    }
});
exports.newEnquiry = newEnquiry;
