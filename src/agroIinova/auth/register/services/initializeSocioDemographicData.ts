import { SocioDemographicModel } from "../../../admin/profile-users/middleware/models/socioDemographic.model";

/**
 * Inicializa la información sociodemográfica de un usuario.
 * Se crean datos predeterminados para que luego el usuario pueda actualizarlos.
 *
 * @param userId - El ID del usuario recién creado.
 * @returns Una promesa que se resuelve cuando la inserción es exitosa.
 */
export const initializeSocioDemographicData = async (userId: number): Promise<void> => {
  await SocioDemographicModel.create({
    userId: userId,
    residenceYears: 0,       // Valor por defecto: 0 años
    residenceMonths: 0,      // Valor por defecto: 0 meses
    selfIdentification: 'Otro',  // Valor por defecto
    otherIdentification: '', // Vacío hasta que el usuario actualice
    ethnicGroup: 'Ninguno',  // Valor por defecto
    ethnicGroupDetail: '',   // Vacío
    hasDisability: false,    // Valor por defecto: sin discapacidad
    disabilityDetail: '',    // Vacío
    conflictVictim: false,   // Valor por defecto: no es víctima
    educationLevel: 'Ninguna'// Valor por defecto
  });
};
