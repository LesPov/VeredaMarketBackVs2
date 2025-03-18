// controllers/registerSocioDemographicController.ts
import { Response } from 'express';
import { errorMessages } from '../../../auth/middleware/errors/errorMessages';
 
import { CustomRequest } from '../../../auth/middleware/valdiateToken/validateToken';
import SocioDemographicModel from '../../../admin/profile-users/middleware/models/socioDemographic.model';
import { successMessagesCp } from '../../middleware/succes/succesMessagesCp';
import { errorMessagesCp } from '../../middleware/errors/errorsMessagesCp';

/**
 * Controlador para registrar la información sociodemográfica de un campesino.
 */
export const registerSocioDemographicData = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    // Extraer el userId del token (validateToken asigna req.user)
    const userId = req.user ? req.user.userId : null;
    console.log('User ID:', userId);
    if (!userId) {
      res.status(401).json({ msg: 'Usuario no autenticado' });
      return;
    }

    // Verificar si el usuario ya tiene información sociodemográfica registrada
    if (await verifySocioDemographicDataExists(userId, res)) return;
 
    // Extraer los datos del body
    const {
      residenceYears,
      residenceMonths,
      selfIdentification,
      otherIdentification,
      ethnicGroup,
      ethnicGroupDetail,
      hasDisability,
      disabilityDetail,
      conflictVictim,
      educationLevel,
    } = req.body;

    // Validar la información sociodemográfica
    const validationErrors = validateSocioDemographicData(
      residenceYears,
      residenceMonths,
      selfIdentification,
      otherIdentification,
      ethnicGroup,
      ethnicGroupDetail,
      hasDisability,
      disabilityDetail,
      conflictVictim,
      educationLevel
    );
    processValidationErrors(validationErrors, res);

    // Guardar en la base de datos
    await SocioDemographicModel.create({
      userId,
      residenceYears,
      residenceMonths,
      selfIdentification,
      otherIdentification,
      ethnicGroup,
      ethnicGroupDetail,
      hasDisability,
      disabilityDetail,
      conflictVictim,
      educationLevel,
    });

    // Enviar respuesta exitosa
    sendSuccessResponse(successMessagesCp.socioDemographicDataRegistered, res);
  } catch (error: any) {
    // Manejar errores generales del servidor
    processServerError(error, res);
  }
};

/**
 * Verifica si el usuario ya tiene registrada la información sociodemográfica.
 * Si ya existe, envía una respuesta de error y retorna true.
 */
export const verifySocioDemographicDataExists = async (userId: number, res: Response): Promise<boolean> => {
  const existingData = await SocioDemographicModel.findOne({ where: { userId } });
  if (existingData) {
    res.status(400).json({
      msg: 'El usuario ya tiene registrada la información sociodemográfica',
      error: 'El usuario ya tiene registrada la información sociodemográfica'
    });
    return true;
  }
  return false;
};

/**
 * Valida los campos obligatorios y formatos básicos de la información sociodemográfica.
 */

export const validateSocioDemographicData = (
    residenceYears: any,
    residenceMonths: any,
    selfIdentification: string,
    otherIdentification: string,
    ethnicGroup: string,
    ethnicGroupDetail: string,
    hasDisability: any,
    disabilityDetail: string,
    conflictVictim: any,
    educationLevel: string
  ): string[] => {
    const errors: string[] = [];
  
    // Validar campos obligatorios
    if (
      residenceYears === undefined ||
      residenceMonths === undefined ||
      !selfIdentification ||
      !ethnicGroup ||
      hasDisability === undefined ||
      conflictVictim === undefined ||
      !educationLevel
    ) {
      errors.push(errorMessagesCp.requiredFields);
    }
  
    // Validar que residenceYears y residenceMonths sean números válidos
    if (residenceYears !== undefined && isNaN(Number(residenceYears))) {
      errors.push(errorMessagesCp.invalidResidenceYears);
    }
    if (residenceMonths !== undefined && isNaN(Number(residenceMonths))) {
      errors.push(errorMessagesCp.invalidResidenceMonths);
    }
  
    // Si se selecciona 'Otro' en autoidentificación, se debe proporcionar el detalle
    if (selfIdentification === 'Otro' && !otherIdentification) {
      errors.push(errorMessagesCp.missingOtherIdentification);
    }
  
    // Validar que hasDisability y conflictVictim sean valores booleanos
    if (typeof hasDisability !== 'boolean') {
      errors.push(errorMessagesCp.invalidHasDisability);
    }
    if (typeof conflictVictim !== 'boolean') {
      errors.push(errorMessagesCp.invalidConflictVictim);
    }
  
    // Si hasDisability es true, disabilityDetail es obligatorio
    if (hasDisability === true && !disabilityDetail) {
      errors.push(errorMessagesCp.missingDisabilityDetail);
    }
  
    // Validar que educationLevel sea uno de los valores permitidos
    const validEducationLevels = ['Ninguna', 'Primaria', 'Secundaria', 'Técnico o Tecnológico', 'Profesional', 'Posgrado'];
    if (!validEducationLevels.includes(educationLevel)) {
      errors.push(errorMessagesCp.invalidEducationLevel);
    }
  
    return errors;
  };

/**
 * Procesa los errores de validación y envía la respuesta de error.
 */
export const processValidationErrors = (errors: string[], res: Response): void => {
  if (errors.length > 0) {
    res.status(400).json({
      msg: errors,
      error: 'Error en la validación de la entrada de datos'
    });
    throw new Error("Input validation failed");
  }
};

/**
 * Maneja los errores generales del servidor.
 */
export const processServerError = (error: any, res: Response) => {
  console.error("Error en el controlador registerSocioDemographicData:", error);
  if (!res.headersSent) {
    res.status(400).json({
      msg: error.message || errorMessages.databaseError,
      error,
    });
    throw new Error("Controller registerSocioDemographicData error");
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
