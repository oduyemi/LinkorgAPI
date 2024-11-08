"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controllers/admin.controller");
const router = express_1.default.Router();
router.get("/", admin_controller_1.getAllAdmin);
router.get("/:adminId", admin_controller_1.getAdminById);
// router.post("/register", registerAdmin);
// router.post("/login", loginAdmin);
// router.put("/:adminId", authenticateAdmin, updatedAdmin);
// router.delete("/:adminId", authenticateAdmin, deleteAdmin);
// router.put("/:adminId/reset-password", authenticateAdmin, resetPassword);
// router.post("/logout", authenticateAdmin, logoutAdmin);
exports.default = router;
