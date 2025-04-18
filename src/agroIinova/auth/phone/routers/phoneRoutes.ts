import { Router } from "express";
import { sendVerificationCodePhone } from "../controller/phoneController";
import { verifyPhoneNumber } from "../validateCode/phoneValidateCodeController";
import { resendVerificationCodePhone } from "../resendCodeController/phoneresendCodeController";

const phoneVerificationRouter = Router();

/**
 * POST /api/user/verify/send
 * Ruta para enviar el código de verificación por SMS.
 * Público
 */
phoneVerificationRouter.post("/phone/send", sendVerificationCodePhone);


 
/**
 * PUT /api/user/verify/phone
 * Ruta para verificar el número de teléfono.
 * Público
 */
phoneVerificationRouter.put('/phone/verify', verifyPhoneNumber);




/**
 * POST /api/user/verify/resend
 * Ruta para reenviar el código de verificación por SMS.
 * Público
 */
phoneVerificationRouter.post("/phone/verify/resend", resendVerificationCodePhone);

export default phoneVerificationRouter;
