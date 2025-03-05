import { Response } from 'express';
import { errorMessages } from '../../../auth/middleware/errors/errorMessages';
import { errorMessagesCp } from '../../middleware/errors/errorsMessagesCp';
import { successMessagesCp } from '../../middleware/succes/succesMessagesCp';
import FamilyCompositionModel from '../../middleware/models/familyComposition.model';
import FamilyMemberModel from '../../middleware/models/familyMember.model';
import { CustomRequest } from '../../../auth/middleware/valdiateToken/validateToken';

/**
 * Verifica si el usuario está autenticado y retorna el userId.
 * En caso de no estar autenticado, responde con error y lanza una excepción.
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
 * Valida que si la mano de obra es "Familiar" o "Mixta", se incluya información de miembros.
 * Retorna un arreglo de errores (vacío si no hay errores).
 */
const validateFamilyMembersForLabor = (
  predominantLabor: string,
  familyMembers: any
): string[] => {
  const errors: string[] = [];
  if (
    (predominantLabor === 'Familiar' || predominantLabor === 'Mixta') &&
    (!familyMembers || !Array.isArray(familyMembers) || familyMembers.length === 0)
  ) {
    errors.push("Se debe proporcionar la información de los miembros familiares que trabajan en la finca.");
  }
  return errors;
};

/**
 * Procesa y registra los miembros familiares.
 * Valida cada miembro y, si alguno presenta error, detiene el proceso.
 */
const handleFamilyMembers = async (userId: number, familyMembers: any, res: Response): Promise<void> => {
  if (familyMembers && Array.isArray(familyMembers)) {
    for (const member of familyMembers) {
      const memberErrors = validateFamilyMemberData(member);
      if (memberErrors.length > 0) {
        processValidationErrors(memberErrors, res);
        return; // Se detiene el proceso si hay errores en algún miembro
      }
      await FamilyMemberModel.create({
        userId,
        relationship: member.relationship,
        gender: member.gender,
        age: member.age,
        educationLevel: member.educationLevel,
        ethnicGroup: member.ethnicGroup,
        hasDisability: member.hasDisability,
        disabilityDetail: member.disabilityDetail,
        roleInProduction: member.roleInProduction,
      });
    }
  }
};

/**
 * Controlador para registrar la composición familiar y, opcionalmente,
 * los miembros familiares que trabajan en la finca.
 */
export const registerFamilyData = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    // 1. Asegurar que el usuario esté autenticado
    const userId = ensureAuthenticated(req, res);

    // 2. Verificar que el usuario no tenga ya registrada la composición familiar
    if (await verifyFamilyCompositionExists(userId, res)) return;

    // 3. Extraer datos del body
    const {
      personsInHome,
      dependentPersons,
      workingPersons,
      predominantLabor,
      familyMembers, // Información opcional de miembros familiares
    } = req.body;

    // 4. Validar la información de la composición familiar
    const compositionErrors = validateFamilyCompositionData(
      personsInHome,
      dependentPersons,
      workingPersons,
      predominantLabor
    );
    // Validar que se provea información de miembros si la mano de obra es "Familiar" o "Mixta"
    compositionErrors.push(...validateFamilyMembersForLabor(predominantLabor, familyMembers));
    processValidationErrors(compositionErrors, res);

    // 5. Registrar la composición familiar en la base de datos
    await FamilyCompositionModel.create({
      userId,
      personsInHome,
      dependentPersons,
      workingPersons,
      predominantLabor,
    });

    // 6. Validar y registrar los miembros familiares (si existen)
    await handleFamilyMembers(userId, familyMembers, res);

    // 7. Enviar respuesta exitosa
    sendSuccessResponse(successMessagesCp.familyDataRegistered, res);
  } catch (error: any) {
    // Manejo de errores generales del servidor
    processServerError(error, res);
  }
};

/**
 * Verifica si el usuario ya tiene registrada la composición familiar.
 * Retorna true y envía error si ya existe.
 */
export const verifyFamilyCompositionExists = async (userId: number, res: Response): Promise<boolean> => {
  const existingComposition = await FamilyCompositionModel.findOne({ where: { userId } });
  if (existingComposition) {
    res.status(400).json({
      msg: 'El usuario ya tiene registrada la composición familiar y mano de obra.',
      error: 'El usuario ya tiene registrada la composición familiar y mano de obra.'
    });
    return true;
  }
  return false;
};

/**
 * Valida los campos obligatorios y formatos básicos de la composición familiar.
 */
export const validateFamilyCompositionData = (
  personsInHome: any,
  dependentPersons: any,
  workingPersons: any,
  predominantLabor: string
): string[] => {
  const errors: string[] = [];
  
  // Verificar que se envíen todos los campos requeridos
  if (
    personsInHome === undefined ||
    dependentPersons === undefined ||
    workingPersons === undefined ||
    !predominantLabor
  ) {
    errors.push("Todos los campos de la composición familiar y mano de obra son obligatorios.");
  }
  
  // Validar que los números sean válidos
  if (personsInHome !== undefined && isNaN(Number(personsInHome))) {
    errors.push("El número de personas que viven en el hogar debe ser un número válido.");
  }
  if (dependentPersons !== undefined && isNaN(Number(dependentPersons))) {
    errors.push("El número de personas que dependen económicamente debe ser un número válido.");
  }
  if (workingPersons !== undefined && isNaN(Number(workingPersons))) {
    errors.push("El número total de personas que trabajan en la unidad productiva debe ser un número válido.");
  }
  
  // Validar que el tipo de mano de obra sea uno de los valores permitidos
  const validLaborTypes = ['Familiar', 'Contratada', 'Mixta'];
  if (!validLaborTypes.includes(predominantLabor)) {
    errors.push("La mano de obra que predomina en la finca debe ser 'Familiar', 'Contratada' o 'Mixta'.");
  }
  
  return errors;
};

/**
 * Valida la información de un miembro familiar.
 */
export const validateFamilyMemberData = (member: any): string[] => {
  const errors: string[] = [];
  
  // Verificar que se envíen todos los campos obligatorios
  if (
    !member.relationship ||
    !member.gender ||
    member.age === undefined ||
    !member.educationLevel ||
    member.hasDisability === undefined
  ) {
    errors.push("Todos los campos obligatorios del miembro familiar deben ser completados.");
  }
  
  // Validar que la edad sea un número válido
  if (member.age !== undefined && isNaN(Number(member.age))) {
    errors.push("La edad del miembro familiar debe ser un número válido.");
  }
  
  // Si el miembro tiene discapacidad, se debe proporcionar el detalle
  if (member.hasDisability === true && (!member.disabilityDetail || member.disabilityDetail.trim() === "")) {
    errors.push("Debe proporcionar detalles de la discapacidad para el miembro familiar.");
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
      error: 'Error en la validación de los datos'
    });
    throw new Error("Input validation failed");
  }
};

/**
 * Maneja los errores generales del servidor.
 */
export const processServerError = (error: any, res: Response): void => {
  console.error("Error en el controlador registerFamilyData:", error);
  if (!res.headersSent) {
    res.status(400).json({
      msg: error.message || errorMessages.databaseError,
      error,
    });
    throw new Error("Controller registerFamilyData error");
  }
};

/**
 * Envía la respuesta exitosa.
 */
export const sendSuccessResponse = (message: string, res: Response): void => {
  res.status(200).json({ msg: message });
};
