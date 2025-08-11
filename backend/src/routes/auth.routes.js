import { Router } from "express";
import { registrar, verificarOTP, login, reenviarOTP } from "../controllers/auth.controller.js";

const router = Router();
router.post("/register", registrar);
router.post("/verify-otp", verificarOTP);
router.post("/login", login);
router.post("/resend-otp", reenviarOTP);

export default router;
