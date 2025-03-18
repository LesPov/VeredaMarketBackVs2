// interfaces/socioDemographicInterface.ts
import { Model } from 'sequelize';

export interface SocioDemographicInterface extends Model {
  id: number;
  userId: number;
  residenceYears: number;
  residenceMonths: number;
  selfIdentification: 'Campesino(a)' | 'Trabajador(a) rural' | 'Habitante rural' | 'Otro';
  otherIdentification?: string;
  ethnicGroup: 'Indígena' | 'Afrocolombiano' | 'Raizales' | 'ROM o gitano' | 'Ninguno';
  ethnicGroupDetail?: string; 
  hasDisability: boolean;
  disabilityDetail?: string;
  conflictVictim: boolean;
  educationLevel: 'Ninguna' | 'Primaria' | 'Secundaria' | 'Técnico o Tecnológico' | 'Profesional' | 'Posgrado';
  // Timestamps (si los necesitas)
  createdAt?: Date;
  updatedAt?: Date;
}
 