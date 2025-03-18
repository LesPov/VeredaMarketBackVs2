import { Request, Response } from 'express';

import { validateInputLogin } from '../utils/validations/loginvalidateInput';
import { handleInputValidationErrors } from '../../register/errors/handleInputValidationErrors';
import { findUserByUsernameLogin, handleUserNotFoundErrorLogin } from '../utils/findUser/findUserByUsernameLogin';
import { checkUserVerificationStatusEmail, handleEmailNotVerificationErroruser } from '../../phone/utils/check/checkUserVerificationStatus';
import { checkUserVerificationStatusPhoneLogin, handlePhoneLoginNotVerificationErroruser } from '../utils/check/checkUserVerificationStatusPhone';
import { handleRandomPasswordValidation } from '../utils/validations/handleRandomPasswordValidation';
import { validatePassword } from '../utils/validations/validatePasswordLogin';
import { handleLoginAttempts } from '../utils/loginAttempts/loginAttemptsService';
import { handleSuccessfulLogin } from '../utils/handleSuccessfu/handleSuccessfulLogin';
import { handleServerErrorLogin } from '../utils/errors/handleServerError';

/** 
 * Controlador para manejar la solicitud de inicio de sesión de un usuario.
 */
export const loginUser = async (req: Request, res: Response) => {
    try {
      // 1. Extraer y validar los datos de entrada
      const { username, passwordorrandomPassword } = req.body;
      const inputValidationErrors = validateInputLogin(username, passwordorrandomPassword);
      handleInputValidationErrors(inputValidationErrors, res);
  
      // 2. Búsqueda del usuario
      const user = await findUserByUsernameLogin(username);
      if (!user) {
        handleUserNotFoundErrorLogin(username, user, res);
        return;
      }
  
      // 3. Verificación del estado del usuario Email
      const isEmailVerified = checkUserVerificationStatusEmail(user);
      handleEmailNotVerificationErroruser(isEmailVerified, res);
  
      // 4. Verificación del estado del usuario Phone
      const isPhoneNumberVerified = checkUserVerificationStatusPhoneLogin(user);
      handlePhoneLoginNotVerificationErroruser(isPhoneNumberVerified, res);
  
      // 5. Determinar si se está usando una contraseña aleatoria
      // Por ejemplo, suponiendo que la contraseña aleatoria siempre tenga 8 caracteres
      const isRandomPassword = passwordorrandomPassword.length === 8;
  
      if (isRandomPassword) {
        // Validamos la contraseña aleatoria y, si es válida, procesamos el login sin pasar por la validación normal
        const isValidRandom = await handleRandomPasswordValidation(user, passwordorrandomPassword, res);
        if (!isValidRandom) return;
        await handleSuccessfulLogin(user, res, passwordorrandomPassword);
        return; // Termina aquí el flujo para random password
      } else {
        // Flujo normal: validamos la contraseña convencional
        const isPasswordValid = await validatePassword(user, passwordorrandomPassword);
        const loginSuccess = await handleLoginAttempts(user.id, isPasswordValid, res);
        if (loginSuccess) {
          await handleSuccessfulLogin(user, res, passwordorrandomPassword);
        }
      }
    } catch (error) {
      // Manejo de errores de servidor
      handleServerErrorLogin(error, res);
    }
  };
  