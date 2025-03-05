import { Response } from 'express';
import { errorMessages } from '../../../auth/middleware/errors/errorMessages';
import { errorMessagesCp } from '../../middleware/errors/errorsMessagesCp';
import { successMessagesCp } from '../../middleware/succes/succesMessagesCp';
import { PersonalDataModel } from '../../middleware/models/personalData.model';
import { CustomRequest } from '../../../auth/middleware/valdiateToken/validateToken';

/**
 * Controlador para registrar los datos personales de un campesino.
 */
export const registerCampesinoPersonalData = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    // Extraer el userId del token (validateToken ya asigna req.user)
    const userId = req.user ? req.user.userId : null;
    console.log('User ID:', userId);

    // Validar que el usuario esté autenticado
    if (userId === null) {
      res.status(401).json({ msg: 'Usuario no autenticado' });
      return;
    }

    // Verificar si el usuario ya tiene información personal registrada
    if (await verifyCampesinoDataExists(userId, res)) return;

    // Extraer el resto de los datos desde el body
    const {
      fullName,
      identificationNumber,
      identificationType,
      birthDate,
      age,
      gender,
      photo,
    } = req.body;

    // Validar los datos personales del campesino
    const validationErrors = validateCampesinoPersonalData(
      fullName,
      identificationNumber,
      identificationType,
      birthDate,
      age,
      gender,
      photo
    );
    processValidationErrors(validationErrors, res);

    // Guardar en la base de datos
    await PersonalDataModel.create({
      userId,
      fullName,
      identificationNumber,
      identificationType,
      birthDate,
      age,
      gender,
      photo,
    });

    // Enviar respuesta exitosa
    sendSuccessResponse(successMessagesCp.personalDataRegistered, res);

  } catch (error: any) {
    // Manejar errores generales del servidor
    processServerError(error, res);
  }
};

/**
 * Verifica si el usuario ya tiene registrada la información personal.
 * Si ya existe, envía una respuesta de error.
 *
 * @param userId - ID del usuario a verificar.
 * @param res - Objeto de respuesta de Express.
 * @returns Promise<boolean> - Devuelve true si ya existe información, false en caso contrario.
 */
export const verifyCampesinoDataExists = async (userId: number, res: Response): Promise<boolean> => {
  const existingData = await PersonalDataModel.findOne({ where: { userId } });
  if (existingData) {
    res.status(400).json({
      msg: 'El usuario ya tiene registrada la información personal',
      error: 'El usuario ya tiene registrada la información personal'
    });
    return true;
  }
  return false;
};

/**
 * Valida los campos obligatorios y formatos básicos de los datos personales del campesino.
 * Además, verifica que el usuario sea mayor de 18 años basado en la fecha de nacimiento.
 */
export const validateCampesinoPersonalData = (
  fullName: string,
  identificationNumber: string,
  identificationType: string,
  birthDate: string,
  age: string,
  gender: string,
  photo: string
): string[] => {
  const errors: string[] = [];

  // Validar campos obligatorios
  if (!fullName || !identificationNumber || !identificationType || !birthDate || !age || !gender || !photo) {
    errors.push(errorMessagesCp.requiredFields);
  }

  // Validar que la edad enviada sea un número válido
  if (age && isNaN(Number(age))) {
    errors.push("La edad debe ser un número válido.");
  }

  // Calcular la edad a partir de la fecha de nacimiento
  const currentDate = new Date();
  const birthDateObj = new Date(birthDate);
  let calculatedAge = currentDate.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = currentDate.getMonth() - birthDateObj.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDateObj.getDate())) {
    calculatedAge--;
  }

  // Validar que el usuario sea mayor de 18 años
  if (calculatedAge < 18) {
    errors.push("El usuario debe ser mayor de 18 años.");
  }

  // Se pueden agregar más validaciones de formato según se requiera
  return errors;
};

/**
 * Procesa los errores de validación y envía la respuesta de error.
 */
export const processValidationErrors = (errors: string[], res: Response): void => {
  if (errors.length > 0) {
    res.status(400).json({
      msg: errors,
      error: 'Error en la validación de la entrada de datos',
    });
    throw new Error("Input validation failed");
  }
};

/**
 * Maneja los errores generales del servidor.
 */
export const processServerError = (error: any, res: Response) => {
  console.error("Error en el controlador registerCampesinoPersonalData:", error);
  if (!res.headersSent) {
    res.status(400).json({
      msg: error.message || errorMessages.databaseError,
      error,
    });
    throw new Error("Controller registerCampesinoPersonalData error");
  }
};

/**
 * Envía la respuesta exitosa.
 */
export const sendSuccessResponse = (message: string, res: Response): void => {
  res.status(200).json({
    msg: message
  });
};
