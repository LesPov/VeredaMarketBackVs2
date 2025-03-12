import { Request, Response } from 'express';
import { errorMessages } from '../../../auth/middleware/errors/errorMessages';
import { CustomRequest } from '../../../auth/middleware/valdiateToken/validateToken';
import { errorMessagesCp } from '../../../campesinos/middleware/errors/errorsMessagesCp';
import { successMessagesCp } from '../../../campesinos/middleware/succes/succesMessagesCp';
import { userProfileModel } from '../../../auth/middleware/models/userProfileModel';
import upload from '../../middlewares/utils/uploadConfig';

/**
 * Encapsula la lógica de subida de imagen y la ejecución del callback.
 */
const handleImageUpload = (req: Request, res: Response, callback: () => Promise<void>) => {
  upload(req, res, (err) => {
    if (err) {
      console.error(`Error en la subida de la imagen: ${err.message}`);
      return res.status(400).json({
        msg: `Error en la subida de la imagen: ${err.message}`,
        errors: 'Error al cargar la imagen',
      });
    }
    callback();
  });
};

/**
 * Controlador para registrar los datos personales del campesino.
 */
export const registerCampesinoPersonalData = async (req: CustomRequest, res: Response): Promise<void> => {
  req.body.perfilCampesino = 'perfilCampesino';

  // Usamos handleImageUpload y forzamos que el callback retorne Promise<void>
  // Dentro de handleImageUpload callback
  
  handleImageUpload(req, res, async (): Promise<void> => {
    try {
      const userId = req.user ? req.user.userId : null;
      if (!userId) {
        res.status(401).json({ msg: 'Usuario no autenticado' });
        return;
      }

      if (await verifyCampesinoDataExists(userId, req.body, res)) return;

      const {
        firstName,
        lastName,
        identificationNumber,
        identificationType,
        biography,
        direccion,
        age,
        gender,
      } = req.body;

      // Forzamos que profilePicture sea un string, ya que se validó que se suba la imagen
      const profilePicture: string = req.file?.filename!;

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

      sendSuccessResponse(successMessagesCp.personalDataRegistered, res);
      return;
    } catch (error: any) {
      processServerError(error, res);
      return;
    }
  });
};

export const verifyCampesinoDataExists = async (userId: number, data: any, res: Response): Promise<boolean> => {
  const existingDataByUser = await userProfileModel.findOne({ where: { userId } });
  if (existingDataByUser) {
    res.status(400).json({
      msg: 'El usuario ya tiene registrada la información personal',
      error: 'El usuario ya tiene registrada la información personal'
    });
    return true;
  }
  const existingByIdentification = await userProfileModel.findOne({ where: { identificationNumber: data.identificationNumber } });
  if (existingByIdentification) {
    res.status(400).json({
      msg: 'El número de identificación ya está registrado',
      error: 'Número de identificación duplicado'
    });
    return true;
  }
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
  if (!firstName || !lastName || !identificationNumber || !identificationType || !age || !gender || !profilePicture) {
    errors.push(errorMessagesCp.requiredFields);
  }
  if (age && isNaN(Number(age))) {
    errors.push("La edad debe ser un número válido.");
  }
  return errors;
};

export const processValidationErrors = (errors: string[], res: Response): void => {
  if (errors.length > 0) {
    res.status(400).json({
      msg: errors,
      error: 'Error en la validación de la entrada de datos',
    });
    throw new Error("Input validation failed");
  }
};

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

export const sendSuccessResponse = (message: string, res: Response): void => {
  res.status(200).json({
    msg: message
  });
};

