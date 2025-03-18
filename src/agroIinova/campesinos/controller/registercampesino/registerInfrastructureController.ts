import { Response } from 'express';
 import { CustomRequest } from '../../../auth/middleware/valdiateToken/validateToken';
import { errorMessages } from '../../../auth/middleware/errors/errorMessages';
import InfrastructureModel from '../../../admin/profile-users/middleware/models/infrastructure.model';

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
 * Valida los campos obligatorios para la infraestructura.
 */
const validateInfrastructureData = (
  mainRoute: any,
  secondaryRoute: any,
  tertiaryRoute: any,
  waterSource: string,
  hasIrrigationSystem: any
): string[] => {
  const errors: string[] = [];
  
  if (!mainRoute || !secondaryRoute || !tertiaryRoute || !waterSource || hasIrrigationSystem === undefined) {
    errors.push("Todos los campos obligatorios de infraestructura son requeridos: condiciones de vías de acceso (principal, secundaria y terciaria), fuente de agua y sistema de riego.");
  }
  
  const validRoutes = ['Pavimentada', 'En afirmado', 'Herradura', 'Adoquín', 'En afirmado con placa huella'];
  if (!validRoutes.includes(mainRoute)) {
    errors.push("La vía principal es inválida.");
  }
  if (!validRoutes.includes(secondaryRoute)) {
    errors.push("La vía secundaria es inválida.");
  }
  if (!validRoutes.includes(tertiaryRoute)) {
    errors.push("La vía terciaria es inválida.");
  }
  
  const validWaterSources = ['Distrito de riego', 'Nacimiento', 'Quebrada', 'Río', 'Reservorio', 'No cuenta', 'Otro'];
  if (!validWaterSources.includes(waterSource)) {
    errors.push("La fuente de agua es inválida.");
  }
  
  if (typeof hasIrrigationSystem !== 'boolean') {
    errors.push("El campo 'hasIrrigationSystem' debe ser un valor booleano.");
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
 * Verifica si el usuario ya tiene registrada la información de infraestructura.
 * Retorna true y responde con error si ya existe.
 */
const verifyInfrastructureExists = async (userId: number, res: Response): Promise<boolean> => {
  const existingInfrastructure = await InfrastructureModel.findOne({ where: { userId } });
  if (existingInfrastructure) {
    res.status(400).json({
      msg: 'El usuario ya tiene registrada la información de infraestructura y capital físico.',
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
  console.error("Error en el controlador registerInfrastructure:", error);
  if (!res.headersSent) {
    res.status(500).json({
      msg: error.message || errorMessages.databaseError,
      error,
    });
    throw new Error("Controller registerInfrastructure error");
  }
};

/**
 * Envía una respuesta exitosa al cliente.
 */
const sendSuccessResponse = (message: string, res: Response): void => {
  res.status(200).json({ msg: message });
};

/**
 * Controlador para registrar la información de infraestructura y capital físico.
 * Se espera recibir en el body:
 *  - Servicios de la vivienda: hasElectricity, hasAcueduct, hasGas, hasInternet, hasSewer, hasPublicLighting, otherService (opcional)
 *  - Condiciones de vías: mainRoute, secondaryRoute, tertiaryRoute
 *  - Fuente de agua: waterSource
 *  - Sistema de riego: hasIrrigationSystem (boolean) y irrigationSystemDetail (opcional)
 */
export const registerInfrastructure = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    // 1. Verificar autenticación
    const userId = ensureAuthenticated(req, res);
    
    // 2. Verificar que no exista ya un registro de infraestructura para el usuario
    if (await verifyInfrastructureExists(userId, res)) return;
    
    // 3. Extraer datos del body
    const {
      hasElectricity,
      hasAcueduct,
      hasGas,
      hasInternet,
      hasSewer,
      hasPublicLighting,
      otherService,
      mainRoute,
      secondaryRoute,
      tertiaryRoute,
      waterSource,
      irrigationSystemDetail,
      hasIrrigationSystem
    } = req.body;
    
    // 4. Validar los datos obligatorios
    const validationErrors = validateInfrastructureData(mainRoute, secondaryRoute, tertiaryRoute, waterSource, hasIrrigationSystem);
    processValidationErrors(validationErrors, res);
    
    // 5. Crear el registro de infraestructura en la base de datos
    await InfrastructureModel.create({
      userId,
      hasElectricity,
      hasAcueduct,
      hasGas,
      hasInternet,
      hasSewer,
      hasPublicLighting,
      otherService,
      mainRoute,
      secondaryRoute,
      tertiaryRoute,
      waterSource,
      irrigationSystemDetail,
      hasIrrigationSystem
    });
    
    // 6. Enviar respuesta exitosa
    sendSuccessResponse("Información de infraestructura registrada exitosamente.", res);
  } catch (error: any) {
    processServerError(error, res);
  }
};
