import { Response } from 'express';
 import { CustomRequest } from '../../../auth/middleware/valdiateToken/validateToken';
import { errorMessages } from '../../../auth/middleware/errors/errorMessages';
import TechnologyPracticeModel from '../../middlewares/models/technologyPractice.model';

/**
 * Asegura que el usuario esté autenticado y retorna su userId.
 */
const ensureAuthenticated = (req: CustomRequest, res: Response): number => {
  const userId = req.user ? req.user.userId : null;
  if (!userId) {
    res.status(401).json({ msg: 'Usuario no autenticado' });
    throw new Error("Usuario no autenticado");
  }
  return userId;
};

/**
 * Valida los datos obligatorios de la tecnología y prácticas productivas.
 */
const validateTechnologyPracticeData = (
  preparationMethod: string,
  pestControlMethod: string
): string[] => {
  const errors: string[] = [];
  
  // Verificar que se envíen los métodos obligatorios
  if (!preparationMethod) {
    errors.push("El método de preparación o conservación del terreno es obligatorio.");
  }
  if (!pestControlMethod) {
    errors.push("El método de control de plagas es obligatorio.");
  }
  
  // Validar que los valores pertenezcan a los enumerados definidos
  const validPreparationMethods = ['Maquinaria', 'Arado de tracción animal', 'Arado manual'];
  if (preparationMethod && !validPreparationMethods.includes(preparationMethod)) {
    errors.push("El método de preparación debe ser 'Maquinaria', 'Arado de tracción animal' o 'Arado manual'.");
  }
  
  const validPestControlMethods = ['Síntesis química (calendario)', 'Síntesis química y biológicos', 'Plaguicidas biológicos', 'Productos orgánicos'];
  if (pestControlMethod && !validPestControlMethods.includes(pestControlMethod)) {
    errors.push("El método de control de plagas debe ser 'Síntesis química (calendario)', 'Síntesis química y biológicos', 'Plaguicidas biológicos' o 'Productos orgánicos'.");
  }
  
  return errors;
};

/**
 * Procesa los errores de validación y responde al cliente.
 */
const processValidationErrors = (errors: string[], res: Response): void => {
  if (errors.length > 0) {
    res.status(400).json({
      msg: errors,
      error: 'Error en la validación de los datos'
    });
    throw new Error("Input validation failed");
  }
};

/**
 * Verifica si ya existe registro de tecnología y prácticas productivas para este usuario.
 */
const verifyTechnologyPracticeExists = async (userId: number, res: Response): Promise<boolean> => {
  const existingRecord = await TechnologyPracticeModel.findOne({ where: { userId } });
  if (existingRecord) {
    res.status(400).json({
      msg: 'El usuario ya tiene registrada la información de tecnología y prácticas productivas.',
      error: 'Registro duplicado.'
    });
    return true;
  }
  return false;
};

/**
 * Maneja los errores generales del servidor.
 */
const processServerError = (error: any, res: Response): void => {
  console.error("Error en el controlador registerTechnologyPractice:", error);
  if (!res.headersSent) {
    res.status(500).json({
      msg: error.message || errorMessages.databaseError,
      error,
    });
    throw new Error("Controller registerTechnologyPractice error");
  }
};

/**
 * Envía una respuesta exitosa al cliente.
 */
const sendSuccessResponse = (message: string, res: Response): void => {
  res.status(200).json({ msg: message });
};

/**
 * Controlador para registrar la información de Tecnología y Prácticas Productivas.
 * Se espera recibir en el body:
 *  - preparationMethod
 *  - (los booleanos de equipos e implementos, con sus respectivos campos opcionales)
 *  - pestControlMethod
 *  - receivedTrainingForBiopreparados
 *  - interestedInTraining
 *  - biopreparadosPestFrequency (opcional)
 *  - biopreparadosFertilizationFrequency (opcional)
 *  - performsMultiplication
 *  - multiplicationDetail (opcional)
 */
export const registerTechnologyPractice = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    // 1. Verificar autenticación
    const userId = ensureAuthenticated(req, res);

    // 2. Verificar que no exista ya un registro para este usuario
    if (await verifyTechnologyPracticeExists(userId, res)) return;

    // 3. Extraer datos del body
    const {
      preparationMethod,
      hasManualFumigadora,
      hasMotorFumigadora,
      hasMilkingEquipment,
      hasGuadana,
      hasManualTools,
      hasElectricPlant,
      hasTractor,
      hasMotocultor,
      hasPicadora,
      hasColdTanks,
      hasMotobomba,
      otherEquipment,
      pestControlMethod,
      receivedTrainingForBiopreparados,
      interestedInTraining,
      biopreparadosPestFrequency,
      biopreparadosFertilizationFrequency,
      performsMultiplication,
      multiplicationDetail
    } = req.body;

    // 4. Validar los datos obligatorios
    const validationErrors = validateTechnologyPracticeData(preparationMethod, pestControlMethod);
    processValidationErrors(validationErrors, res);

    // 5. Registrar el registro en la base de datos
    await TechnologyPracticeModel.create({
      userId,
      preparationMethod,
      hasManualFumigadora,
      hasMotorFumigadora,
      hasMilkingEquipment,
      hasGuadana,
      hasManualTools,
      hasElectricPlant,
      hasTractor,
      hasMotocultor,
      hasPicadora,
      hasColdTanks,
      hasMotobomba,
      otherEquipment,
      pestControlMethod,
      receivedTrainingForBiopreparados,
      interestedInTraining,
      biopreparadosPestFrequency,
      biopreparadosFertilizationFrequency,
      performsMultiplication,
      multiplicationDetail
    });

    // 6. Enviar respuesta exitosa
    sendSuccessResponse("Información de tecnología y prácticas productivas registrada exitosamente.", res);
  } catch (error: any) {
    processServerError(error, res);
  }
};
