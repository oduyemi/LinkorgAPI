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
exports.newContact = exports.getContactById = exports.getAllContacts = void 0;
const contact_model_1 = __importDefault(require("../models/contact.model"));
const getAllContacts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contacts = yield contact_model_1.default.find();
        res.status(200).json(contacts);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving contact data", error: error.message });
    }
});
exports.getAllContacts = getAllContacts;
const getContactById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const contact = yield contact_model_1.default.findById(id);
        if (!contact) {
            res.status(404).json({ message: "Contact data not found" });
            return;
        }
        res.status(200).json(contact);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving contact data", error: error.message });
    }
});
exports.getContactById = getContactById;
const newContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone, message } = req.body;
        if (![name, email, phone, message].every(field => field)) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        const addContact = new contact_model_1.default({ name, email, phone, message });
        yield addContact.save();
        res.status(201).json({ message: "New contact form added successfully" });
    }
    catch (error) {
        console.error("Error during contact data creation:", error);
        res.status(500).json({ message: "Error creating contact data" });
    }
});
exports.newContact = newContact;
