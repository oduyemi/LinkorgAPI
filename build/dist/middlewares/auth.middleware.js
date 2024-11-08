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
exports.authenticateAdmin = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const admin_model_1 = __importDefault(require("../models/admin.model"));
dotenv_1.default.config();
const authenticateAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.session.admin) {
            return res.status(401).json({ message: "Unauthorized. No admin session found." });
        }
        const { adminID } = req.session.admin;
        const admin = yield admin_model_1.default.findById(adminID);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found." });
        }
        next();
    }
    catch (error) {
        console.error("Error during authentication:", error);
        return res.status(401).json({ message: "Unauthorized. Invalid session or token." });
    }
});
exports.authenticateAdmin = authenticateAdmin;
