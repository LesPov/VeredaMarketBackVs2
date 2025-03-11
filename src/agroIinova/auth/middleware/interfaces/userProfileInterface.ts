import { Model } from 'sequelize';
import { AuthInterface } from './authInterface';

// Modelo para el perfil de usuario
export interface UserProfileinterface extends Model {
  id: number;
  userId: number;
  profilePicture: string | null;
  firstName: string;
  lastName: string;
  identificationType: 'Cédula' | 'Tarjeta de Identidad' | 'DNI' | 'Pasaporte' | 'Licencia de Conducir' | 'Otro';
  identificationNumber: string;
  biography: string | null;
  direccion: string | null;
  age: number;
  gender: 'Mujer' | 'Hombre' | 'Otro género' | 'Prefiero no declarar';
  status: 'Activado' | 'Desactivado';
  auth?: AuthInterface; // Relación opcional con el modelo de autenticación
}