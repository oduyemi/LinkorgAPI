"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const retail_controller_1 = require("../controllers/retail.controller");
const router = express_1.default.Router();
router.get("/", retail_controller_1.getAllRetailPlans);
router.get("/booking/:id", retail_controller_1.getRetailPlanById);
router.post("/booking", retail_controller_1.retailBooking);
exports.default = router;
