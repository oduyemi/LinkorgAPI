"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const enterprise_controller_1 = require("../controllers/enterprise.controller");
const router = express_1.default.Router();
router.get("/", enterprise_controller_1.getAllEnteprisePlans);
router.get("/booking/:id", enterprise_controller_1.getEnterprisePlanById);
router.post("/booking", enterprise_controller_1.enterpriseBooking);
exports.default = router;
