import { Model } from 'sequelize';

/**
 * Interfaz para el modelo de datos personales (`PersonalDataModel`).
 * Representa la estructura de la tabla `personalData` en la base de datos.
 */
export interface PersonalDataInterface extends Model {
  /** Identificador único del registro (clave primaria). */
  id: number;
  /** Clave foránea que relaciona este registro con el usuario en la tabla `auth`. */
  userId: number;
  /** Nombre completo del productor o campesino. */
  fullName: string;
  /** Número de identificación del productor. */
  identificationNumber: string;
  /** Tipo de identificación del productor. */
  identificationType: 'Cédula' | 'Tarjeta de Identidad' | 'DNI' | 'Pasaporte' | 'Licencia de Conducir' | 'Otro';
  /** Fecha de nacimiento (formato: YYYY-MM-DD). */
  birthDate: string;
  /** Edad del productor. */
  age: number;
  /** Género del productor. */
  gender: 'Mujer' | 'Hombre' | 'Otro género' | 'Prefiero no declarar';

  /** Ruta o URL de la fotografía del productor (opcional). */
  photo?: string;
}
