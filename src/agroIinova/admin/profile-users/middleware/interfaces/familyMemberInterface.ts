// interfaces/familyMemberInterface.ts
import { Model } from 'sequelize';

export interface FamilyMemberInterface extends Model {
  id: number;
  userId: number;
  relationship: string;  // Ej: "cónyuge", "hijo/a", etc.
  gender: 'Mujer' | 'Hombre' | 'Otro' | 'Prefiero no declarar';
  age: number;
  educationLevel: string;
  ethnicGroup?: string;  // Opcional, ya que puede no especificarse
  hasDisability: boolean;
  disabilityDetail?: string;  // Opcional, se requiere solo si tiene discapacidad
  roleInProduction?: string;  // Opcional, para describir el rol en la unidad productiva
  createdAt?: Date;
  updatedAt?: Date;
}
