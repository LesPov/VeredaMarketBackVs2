import { Request, Response } from 'express';
import {  handleServerErrorRequestPassword1 } from './utils/errors/handleServerError';
import { validateInputrRequestPassword } from './utils/validations/resentValidation';
import { findUseRrequestPassword } from './utils/findUser/findUserPasswordReset';
import { handleUserNotFoundErrorLogin } from '../utils/findUser/findUserByUsernameLogin';
import { checkisUserVerified, handleUnverifiedUserError } from './utils/check/checkUserVerificationStatus';
import { generateAndSetRandomPassword } from './utils/generate/generateAndRandomPassword';
import { sendPasswordResetEmailPasswordReset } from './utils/email/sendEmailCode';
import { handleSuccessMessagePasswordReset } from './utils/success/handleSuccessMessage';
import { handleInputValidationErrors } from '../../register/errors/handleInputValidationErrors';


export const requestPasswordReset = async (req: Request, res: Response) => {
    try {
        // 1. Extraer y validar los datos de entrada
        const { usernameOrEmail } = req.body;
        const inputValidationErrors = validateInputrRequestPassword(usernameOrEmail);
        handleInputValidationErrors(inputValidationErrors, res);

        // 2. Búsqueda del usuario
        const user = await findUseRrequestPassword(usernameOrEmail);
        if (!user) {
            handleUserNotFoundErrorLogin(usernameOrEmail, user, res);
            return;
        }

        // 3. Verificación del estado del usuario isverified 
        const isVerified = checkisUserVerified(user);
        handleUnverifiedUserError(isVerified, res);

        // 4. Genera una nueva contraseña aleatoria y actualiza el registro de verificación
        const randomPassword = await generateAndSetRandomPassword(user.id);

        // 5. Envía un correo electrónico con la nueva contraseña aleatoria
        await sendPasswordResetEmailPasswordReset(user.email, user.username, randomPassword);

        // 6. Envia el mesge de exito
        handleSuccessMessagePasswordReset(res);

    } catch (error) {

        // 7. Manejo de errores de servidor
        handleServerErrorRequestPassword1(error, res);
    }
};
