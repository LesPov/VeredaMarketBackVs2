import { Response } from 'express';
import { errorMessages } from '../../../auth/middleware/errors/errorMessages';
import { CustomRequest } from '../../../auth/middleware/valdiateToken/validateToken';
import { errorMessagesCp } from '../../middleware/errors/errorsMessagesCp';
import { successMessagesCp } from '../../middleware/succes/succesMessagesCp';
import { userProfileModel } from '../../../auth/middleware/models/userProfileModel';

/**
 * Controlador para registrar los datos personales del campesino.
 */
export const registerCampesinoPersonalData = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    // Extraer el userId del token
    const userId = req.user ? req.user.userId : null;
    console.log('User ID:', userId);

    // Validar que el usuario esté autenticado
    if (userId === null) {
      res.status(401).json({ msg: 'Usuario no autenticado' });
      return;
    }

    // Verificar si el usuario ya tiene información personal registrada
    if (await verifyCampesinoDataExists(userId, req.body, res)) return;

    // Extraer los datos correctos desde el body
    const {
      firstName,
      lastName,
      identificationNumber,
      identificationType,
      biography,
      direccion,
      age,
      gender,
      profilePicture, // en lugar de "photo"
    } = req.body;

    // Validar los datos personales del campesino
    const validationErrors = validateCampesinoPersonalData(
      firstName,
      lastName,
      identificationNumber,
      identificationType,
      age,
      gender,
      profilePicture
    );
    processValidationErrors(validationErrors, res);

    // Guardar en la base de datos. El campo "status" se activa automáticamente por defecto.
    await userProfileModel.create({
      userId,
      firstName,
      lastName,
      identificationNumber,
      identificationType,
      biography,
      direccion,
      age,
      gender,
      profilePicture,
    });

    // Enviar respuesta exitosa
    sendSuccessResponse(successMessagesCp.personalDataRegistered, res);

  } catch (error: any) {
    // Manejar errores generales del servidor
    processServerError(error, res);
  }
};

/**
 * Verifica si el usuario ya tiene registrada la información personal o si ya existen
 * registros con el mismo número de identificación o combinación de nombres.
 */
export const verifyCampesinoDataExists = async (userId: number, data: any, res: Response): Promise<boolean> => {
  // Verificar por userId (cada usuario solo puede tener un registro)
  const existingDataByUser = await userProfileModel.findOne({ where: { userId } });
  if (existingDataByUser) {
    res.status(400).json({
      msg: 'El usuario ya tiene registrada la información personal',
      error: 'El usuario ya tiene registrada la información personal'
    });
    return true;
  }
  // Verificar que el número de identificación sea único
  const existingByIdentification = await userProfileModel.findOne({ where: { identificationNumber: data.identificationNumber } });
  if (existingByIdentification) {
    res.status(400).json({
      msg: 'El número de identificación ya está registrado',
      error: 'Número de identificación duplicado'
    });
    return true;
  }
  // (Opcional) Verificar que la combinación de firstName y lastName sea única si es necesario
  const existingByName = await userProfileModel.findOne({ where: { firstName: data.firstName, lastName: data.lastName } });
  if (existingByName) {
    res.status(400).json({
      msg: 'El nombre ya está registrado',
      error: 'Nombre duplicado'
    });
    return true;
  }
  return false;
};

/**
 * Valida los campos obligatorios y formatos básicos de los datos personales del campesino.
 */
export const validateCampesinoPersonalData = (
  firstName: string,
  lastName: string,
  identificationNumber: string,
  identificationType: string,
  age: string,
  gender: string,
  profilePicture: string
): string[] => {
  const errors: string[] = [];

  // Validar campos obligatorios
  if (!firstName || !lastName || !identificationNumber || !identificationType || !age || !gender || !profilePicture) {
    errors.push(errorMessagesCp.requiredFields);
  }

  // Validar que la edad enviada sea un número válido
  if (age && isNaN(Number(age))) {
    errors.push("La edad debe ser un número válido.");
  }

  // Puedes agregar validaciones adicionales (por ejemplo, formato del número de identificación)

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
