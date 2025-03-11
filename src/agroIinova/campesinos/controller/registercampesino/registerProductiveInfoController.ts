import { Response } from 'express';
 import { CustomRequest } from '../../../auth/middleware/valdiateToken/validateToken';
import { errorMessages } from '../../../auth/middleware/errors/errorMessages';
import ProductiveInfoModel from '../../middleware/models/productiveInfo.model';

/**
 * Asegura que el usuario esté autenticado y retorna su userId.
 * Si no lo está, responde con error y detiene el flujo.
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
 * Valida los datos obligatorios de la información productiva.
 */
const validateProductiveInfoData = (
  economicActivity: string,
  agroIncomePercentage: string,
  autoconsumoPercentage: string,
  consumptionFrequency: string,
  consumptionChange: string
): string[] => {
  const errors: string[] = [];
  
  if (
    !economicActivity ||
    !agroIncomePercentage ||
    !autoconsumoPercentage ||
    !consumptionFrequency ||
    !consumptionChange
  ) {
    errors.push("Todos los campos de la información productiva son obligatorios: actividad económica, porcentaje de ingresos, porcentaje de autoconsumo, frecuencia de consumo y cambios en la producción.");
  }
  
  const validEconomicActivities = ['Agrícola', 'Pecuaria', 'Agropecuaria', 'Silvopastoril', 'Agrosilvopastoril'];
  if (!validEconomicActivities.includes(economicActivity)) {
    errors.push("La actividad económica debe ser 'Agrícola', 'Pecuaria', 'Agropecuaria', 'Silvopastoril' o 'Agrosilvopastoril'.");
  }
  
  const validPercentageRanges = ['0-25%', '25-50%', '50-75%', 'Más de 75%'];
  if (!validPercentageRanges.includes(agroIncomePercentage)) {
    errors.push("El porcentaje de ingresos debe ser '0-25%', '25-50%', '50-75%' o 'Más de 75%'.");
  }
  if (!validPercentageRanges.includes(autoconsumoPercentage)) {
    errors.push("El porcentaje de autoconsumo debe ser '0-25%', '25-50%', '50-75%' o 'Más de 75%'.");
  }
  
  const validFrequencies = ['Diariamente', 'Semanalmente', 'Mensualmente', 'Rara vez'];
  if (!validFrequencies.includes(consumptionFrequency)) {
    errors.push("La frecuencia de consumo debe ser 'Diariamente', 'Semanalmente', 'Mensualmente' o 'Rara vez'.");
  }
  
  const validConsumptionChanges = ['Ha aumentado', 'Ha disminuido', 'Se ha mantenido'];
  if (!validConsumptionChanges.includes(consumptionChange)) {
    errors.push("El cambio en la cantidad de productos debe ser 'Ha aumentado', 'Ha disminuido' o 'Se ha mantenido'.");
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
 * Verifica si el usuario ya tiene registrada la información productiva.
 * Retorna true y responde con error si ya existe.
 */
const verifyProductiveInfoExists = async (userId: number, res: Response): Promise<boolean> => {
  const existingInfo = await ProductiveInfoModel.findOne({ where: { userId } });
  if (existingInfo) {
    res.status(400).json({
      msg: 'El usuario ya tiene registrada la información productiva.',
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
  console.error("Error en el controlador registerProductiveInfo:", error);
  if (!res.headersSent) {
    res.status(500).json({
      msg: error.message || errorMessages.databaseError,
      error,
    });
    throw new Error("Controller registerProductiveInfo error");
  }
};

/**
 * Envía una respuesta exitosa al cliente.
 */
const sendSuccessResponse = (message: string, res: Response): void => {
  res.status(200).json({ msg: message });
};

/**
 * Controlador para registrar la información productiva.
 * Se espera recibir en el body:
 *  - economicActivity, agroIncomePercentage, autoconsumoPercentage,
 *    consumptionFrequency, consumptionChange
 */
export const registerProductiveInfo = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    // 1. Verificar autenticación
    const userId = ensureAuthenticated(req, res);
    
    // 2. Verificar que no exista ya un registro para la información productiva del usuario
    if (await verifyProductiveInfoExists(userId, res)) return;
    
    // 3. Extraer datos del body
    const {
      economicActivity,
      agroIncomePercentage,
      autoconsumoPercentage,
      consumptionFrequency,
      consumptionChange
    } = req.body;
    
    // 4. Validar los datos obligatorios
    const validationErrors = validateProductiveInfoData(
      economicActivity,
      agroIncomePercentage,
      autoconsumoPercentage,
      consumptionFrequency,
      consumptionChange
    );
    processValidationErrors(validationErrors, res);
    
    // 5. Crear el registro en la base de datos
    await ProductiveInfoModel.create({
      userId,
      economicActivity,
      agroIncomePercentage,
      autoconsumoPercentage,
      consumptionFrequency,
      consumptionChange
    });
    
    // 6. Enviar respuesta exitosa
    sendSuccessResponse("Información productiva registrada exitosamente.", res);
  } catch (error: any) {
    processServerError(error, res);
  }
};
