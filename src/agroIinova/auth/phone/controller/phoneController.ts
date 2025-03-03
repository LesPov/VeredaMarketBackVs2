import { Request, Response } from 'express';
import { validateInput } from '../utils/validations/validateInput';
import { handleServerError } from '../utils/errors/handleServerError';
import { handleUserNotFoundError } from '../utils/errors/handleUserNotFoundError';
import { checkUserVerificationStatusEmail, handleEmailNotVerificationErroruser } from '../utils/check/checkUserVerificationStatus';
import { checkUserPhoneSendCode, handlePhoneVerificationError } from '../utils/check/checkUserPhoneSendCode';
import { checkUserPhoneNumberAssociation, handlePhoneNumberAssociationError } from '../utils/check/checkUserPhoneNumberAssociation';
import { createVerificationEntryPhone } from '../utils/check/createVerificationEntryPhone';
import { updatePhoneNumber } from '../utils/updatePhone/updatePhoneNumber';
import { sendWhatsAppMessage } from '../utils/send/sendWhatsAppMessage';
import { handleInputValidationErrors } from '../../register/errors/handleInputValidationErrors';
import { findUserByUsername } from '../../email/utils/findUser/findUserByUsername';

export const sendVerificationCodePhone = async (req: Request, res: Response) => {
    try {
        // 1. Validación de entrada
        const { username, phoneNumber } = req.body;
        const inputValidationErrors = validateInput(username, phoneNumber);
        handleInputValidationErrors(inputValidationErrors, res);

        // 2. Búsqueda del usuario si existe
        const user = await findUserByUsername(username);
        handleUserNotFoundError(username, user, res);

        // 3. Verificación del estado del usuario Email
        const isEmailVerified = checkUserVerificationStatusEmail(user);
        handleEmailNotVerificationErroruser(isEmailVerified, res);

        // 4. Verificación del número de teléfono si ya está registrado
        const isPhoneNumberVerified = await checkUserPhoneSendCode(phoneNumber);
        handlePhoneVerificationError(isPhoneNumberVerified, res);

        // 5. Verificación de asociación de número de teléfono
        const isPhoneNumberAssociated = checkUserPhoneNumberAssociation(user);
        handlePhoneNumberAssociationError(isPhoneNumberAssociated, res);

        if (!user) return; // Si user es null, sale de la función

        // 6. Guardar en la base de datos el número de teléfono
        await updatePhoneNumber(user.id, phoneNumber);

        // 7. Generar nuevo código de verificación
        const sendcodesms = await createVerificationEntryPhone(user.id, phoneNumber);

        // Construir el enlace con el formato correcto, incluyendo ambos parámetros.
        const phoneRegistrationLink = `${process.env.FRONTEND_URL}/auth/verifynumber?username=${encodeURIComponent(username)}&phoneNumber=${encodeURIComponent(phoneNumber)}`;

        // Formatear el mensaje con saltos de línea adicionales.
        // También puedes intentar envolver la URL entre "<" y ">" para mayor claridad.
        const message = `Tu código de verificación es: ${sendcodesms}\n\n` +
            `Si te saliste de la página, puedes continuar el proceso haciendo clic en el siguiente enlace:\n` +
            `<${phoneRegistrationLink}>`;

        console.log('El mensaje enviado fue:', message);

        // Enviar el mensaje por WhatsApp
        await sendWhatsAppMessage(phoneNumber, message);


        // 9. Responder con un mensaje de éxito
        res.status(200).json({ message: 'Código de verificación y enlace enviados exitosamente por WhatsApp.' });
    } catch (error) {
        // Manejar errores generales del servidor y responder con un mensaje de error
        handleServerError(error, res);
    }
};
