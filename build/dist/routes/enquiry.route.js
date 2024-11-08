"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const enquiry_controller_1 = require("../controllers/enquiry.controller");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const router = express_1.default.Router();
router.get("/", enquiry_controller_1.getAllEnquiries);
router.get("/enquiry/:id", enquiry_controller_1.getEnquiryById);
router.post("/enquiry", (0, validation_middleware_1.validateRequestBody)(["fname", "lname", "email", "company", "address", "phone", "state", "topic", "message"]), enquiry_controller_1.newEnquiry);
exports.default = router;
