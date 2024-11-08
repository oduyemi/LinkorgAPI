"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contact_controller_1 = require("../controllers/contact.controller");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const router = express_1.default.Router();
router.get("/", contact_controller_1.getAllContacts);
router.get("/:id", contact_controller_1.getContactById);
router.post("/contact", (0, validation_middleware_1.validateRequestBody)(["name", "email", "phone", "subject", "message"]), contact_controller_1.newContact);
exports.default = router;
