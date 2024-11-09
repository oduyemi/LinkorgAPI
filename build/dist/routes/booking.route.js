"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const booking_controller_1 = require("../controllers/booking.controller");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const router = express_1.default.Router();
router.get("/", booking_controller_1.getAllBookings);
router.get("/booking/:id", booking_controller_1.getBookingById);
router.post("/booking", (0, validation_middleware_1.validateRequestBody)(["name", "company", "email", "address", "service", "how", "phone", "state", "lga", "specialRequest"]), booking_controller_1.newBooking);
exports.default = router;
