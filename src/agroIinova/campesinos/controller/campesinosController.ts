import {  Response } from 'express';
import { errorMessages } from '../../auth/middleware/errors/errorMessages';
import { errorMessagesCp } from '../middleware/errors/errorsMessagesCp';
import { successMessagesCp } from '../middleware/succes/succesMessagesCp';
import { PersonalDataModel } from '../middleware/models/personalData.model';
import { CustomRequest } from '../../auth/middleware/valdiateToken/validateToken';

/**
 * Controlador para registrar los datos personales de un campesino.
 */

//

export const registerPersonalDataCp = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      // Extraer el userId del token (validateToken ya asigna req.user)
      const userId = req.user ? req.user.userId : null;
      console.log('User ID:', userId); // Debug
  
      // Verificar que userId no sea null
      if (userId === null) {
        res.status(401).json({ msg: 'Usuario no autenticado' });
        return;
      }
  
      // Verificar si el usuario ya tiene información personal registrada
      if (await checkIfPersonalDataExists(userId, res)) return;
  
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
  
      // Validar la entrada de datos personales
      const inputValidationErrors = validatePersonalDataInput(
        fullName,
        identificationNumber,
        identificationType,
        birthDate,
        age,
        gender,
        photo
      );
      handleInputValidationErrors(inputValidationErrors, res);
  
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
      handleSuccessMessage(successMessagesCp.personalDataRegistered, res);
  
    } catch (error: any) {
      // Manejar errores generales del servidor
      handleServerError(error, res);
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
export const checkIfPersonalDataExists = async (userId: number, res: Response): Promise<boolean> => {
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
 * Función para validar los campos obligatorios y formatos básicos.
 */
export const validatePersonalDataInput = (
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

    // Ejemplo: validar que la edad sea un número
    if (age && isNaN(Number(age))) {
        errors.push("La edad debe ser un número válido.");
    }

    // Se pueden agregar más validaciones de formato según se requiera

    return errors;
};


/** 
 * 
 * Función para manejar los errores de validación.
 */
export const handleInputValidationErrors = (errors: string[], res: Response): void => {
    if (errors.length > 0) {
        res.status(400).json({
            msg: errors,
            error: 'Error en la validación de la entrada de datos',
        });
        throw new Error("Input validation failed");
    }
};

/**
 * Función para manejar errores generales del servidor.
 */
export const handleServerError = (error: any, res: Response) => {
    console.error("Error en el controlador registerPersonalDataCp:", error);
    if (!res.headersSent) {
        res.status(400).json({
            msg: error.message || errorMessages.databaseError,
            error,
        });
        throw new Error("Controller registerPersonalDataCp error");
    }
};


/**
 * Función para enviar el mensaje de éxito.
 */
export const handleSuccessMessage = (message: string, res: Response): void => {
    res.status(200).json({
        msg: message
    });
};
