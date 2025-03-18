import { Response } from 'express';
import { CustomRequest } from '../../../auth/middleware/valdiateToken/validateToken';
import { errorMessages } from '../../../auth/middleware/errors/errorMessages';
import FarmProfile from '../../../admin/profile-users/middleware/models/farmProfile.model';

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
 * Valida los datos obligatorios del predio productivo.
 */
const validateFarmProfileData = (
  address: any,
  vereda: any,
  municipality: any,
  department: any,
  landType: string,
  housingLocation: string,
  totalArea: any
): string[] => {
  const errors: string[] = [];
  
  if (!address || !vereda || !municipality || !department || !landType || !housingLocation || totalArea === undefined) {
    errors.push("Todos los campos obligatorios del predio son requeridos: dirección, vereda, municipio, departamento, tipo de terreno, ubicación de la vivienda y área total.");
  }
  
  if (totalArea !== undefined && isNaN(Number(totalArea))) {
    errors.push("El área total debe ser un número válido.");
  }
  
  const validLandTypes = ['Propio', 'Arriendo', 'Sana Posesión', 'Ocupación', 'Anticresis', 'Usufructo'];
  if (!validLandTypes.includes(landType)) {
    errors.push("El tipo de terreno debe ser 'Propio', 'Arriendo', 'Sana Posesión', 'Ocupación', 'Anticresis' o 'Usufructo'.");
  }
  
  const validHousingLocations = [
    'Dentro del predio',
    'Predio colindante',
    'Predio no colindante (misma vereda)',
    'Predio no colindante (otra vereda)',
    'Predio no colindante (otro municipio)',
    'Otra'
  ];
  if (!validHousingLocations.includes(housingLocation)) {
    errors.push("La ubicación de la vivienda respecto al predio es inválida.");
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
 * Verifica si el usuario ya tiene registrada la información del predio.
 * Retorna true y responde con error si ya existe.
 */
const verifyFarmProfileExists = async (userId: number, res: Response): Promise<boolean> => {
  const existingProfile = await FarmProfile.findOne({ where: { userId } });
  if (existingProfile) {
    res.status(400).json({
      msg: 'El usuario ya tiene registrada la información del predio productivo.',
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
  console.error("Error en el controlador registerFarmProfile:", error);
  if (!res.headersSent) {
    res.status(500).json({
      msg: error.message || errorMessages.databaseError,
      error,
    });
    throw new Error("Controller registerFarmProfile error");
  }
};

/**
 * Envía una respuesta exitosa al cliente.
 */
const sendSuccessResponse = (message: string, res: Response): void => {
  res.status(200).json({ msg: message });
};

/**
 * Controlador para registrar la información del predio productivo.
 * Se espera recibir en el body:
 *  - address, vereda, municipality, department, gpsCoordinates (opcional)
 *  - landType, housingLocation, totalArea, y división de áreas (areaPecuaria, areaAgricola, areaForestal, areaReservaNatural - opcionales)
 */
export const registerFarmProfile = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    // 1. Verificar autenticación
    const userId = ensureAuthenticated(req, res);
    
    // 2. Verificar que no exista ya un registro para el usuario
    if (await verifyFarmProfileExists(userId, res)) return;
    
    // 3. Extraer datos del body
    const {
      address,
      vereda,
      municipality,
      department,
      gpsCoordinates,
      landType,
      housingLocation,
      totalArea,
      areaPecuaria,
      areaAgricola,
      areaForestal,
      areaReservaNatural
    } = req.body;
    
    // 4. Validar los datos obligatorios
    const validationErrors = validateFarmProfileData(address, vereda, municipality, department, landType, housingLocation, totalArea);
    processValidationErrors(validationErrors, res);
    
    // 5. Crear el registro del predio en la base de datos
    await FarmProfile.create({
      userId,
      address,
      vereda,
      municipality,
      department,
      gpsCoordinates,
      landType,
      housingLocation,
      totalArea,
      areaPecuaria,
      areaAgricola,
      areaForestal,
      areaReservaNatural
    });
    
    // 6. Enviar respuesta exitosa
    sendSuccessResponse("Información del predio registrada exitosamente.", res);
  } catch (error: any) {
    processServerError(error, res);
  }
};
