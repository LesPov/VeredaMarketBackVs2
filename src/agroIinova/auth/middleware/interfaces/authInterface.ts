import { Model } from 'sequelize';

/**
 * Interfaz para el modelo de autenticación de usuarios.
 * Representa la estructura de la tabla `auth` en la base de datos.
 */
export interface AuthInterface extends Model {
  /** Identificador único para el usuario (clave primaria). */
  id: number;
  /** Nombre de usuario único. */
  username: string;
  /** Contraseña del usuario (almacenada de manera segura). */
  password: string;
  /** Correo electrónico único del usuario. */
  email: string;
  /** Número de teléfono del usuario. */
  phoneNumber?: string;
  /** Rol del usuario en el sistema (e.g., user, admin, supervisor). */
  rol: 'user' | 'admin' | 'supervisor';
  /** Estado de verificación o proceso (e.g., pendiente, aprobado, rechazado). */
  status: 'pendiente' | 'aprobado' | 'rechazado';
}
