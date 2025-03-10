// middleware/errors/errorsMessagesCp.ts
export const errorMessagesCp = {
  requiredFields: 'Todos los campos obligatorios deben ser completados.',
  requiredUserId: 'El ID de usuario es obligatorio.',
  requiredFullName: 'El nombre completo es obligatorio.',
  requiredIdentificationNumber: 'El número de identificación es obligatorio.',
  requiredIdentificationType: 'El tipo de identificación es obligatorio.',
  requiredBirthDate: 'La fecha de nacimiento es obligatoria.',
  invalidAge: 'La edad debe ser un número mayor a 0.',
  invalidGender: 'El género proporcionado no es válido.',
  requiredMobilePhone: 'El teléfono móvil es obligatorio.',
  invalidSecondaryEmail: 'El correo secundario no tiene un formato válido.',
  invalidPhoto: 'La foto debe ser una URL válida.',
  // Nuevos mensajes para información sociodemográfica:
  invalidResidenceYears: 'Los años de residencia deben ser un número válido.',
  invalidResidenceMonths: 'Los meses de residencia deben ser un número válido.',
  missingOtherIdentification: "Debe proporcionar la autoidentificación cuando se selecciona 'Otro'.",
  invalidHasDisability: 'El campo de discapacidad debe ser un valor booleano.',
  invalidConflictVictim: 'El campo de víctima del conflicto debe ser un valor booleano.',
  missingDisabilityDetail: 'Debe proporcionar detalles de la discapacidad.',
  invalidEducationLevel: 'El nivel de escolaridad no es válido.'
};
