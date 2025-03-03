import { Router } from "express";
import verifyUserRateLimit from "../middleware/verifyUserRateLimit";
import { resendVerificationCode } from "../resendCode/resendCodeController";
import { verifyUser } from "../controller/emailController";

const emailVerificationRoutes = Router();

/**
 * PUT /api/user/verify/email
 * Ruta para verificar el correo electrónico.
 * Público
 */
emailVerificationRoutes.put('/verify/email', verifyUserRateLimit, verifyUser);

/**
 * POST /api/user/verify/email/resend
 * Ruta para reenviar el código de verificación por correo electrónico.
 * Público
 */
emailVerificationRoutes.post('/verify/email/resend', verifyUserRateLimit, resendVerificationCode);


export default emailVerificationRoutes;
