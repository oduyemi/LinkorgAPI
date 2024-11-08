import express from "express";
import { 
    getAllAdmin,
    getAdminById,
    registerAdmin, 
    loginAdmin, 
    updateAdmin, 
    deleteAdmin, 
    resetPassword, 
    logoutAdmin 
} from "../controllers/admin.controller";
import { authenticateAdmin } from "../middlewares/auth.middleware"; 

const router = express.Router();

router.get("/", getAllAdmin);
router.get("/:adminId", getAdminById);
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.put("/:adminId", authenticateAdmin, updateAdmin);
router.delete("/:adminId", authenticateAdmin, deleteAdmin);
router.put("/:adminId/reset-password", authenticateAdmin, resetPassword);
router.post("/logout", authenticateAdmin, logoutAdmin);

export default router;
