import { Model } from "sequelize";

export interface TechnologyPracticeInterface extends Model {
  id?: number;
  userId: number;
  // Para la preparación o conservación de terrenos
  preparationMethod: 'Maquinaria' | 'Arado de tracción animal' | 'Arado manual';
  // Equipos e implementos disponibles
  hasManualFumigadora: boolean;
  hasMotorFumigadora: boolean;
  hasMilkingEquipment: boolean;
  hasGuadana: boolean;
  hasManualTools: boolean;
  hasElectricPlant: boolean;
  hasTractor: boolean;
  hasMotocultor: boolean;
  hasPicadora: boolean;
  hasColdTanks: boolean;
  hasMotobomba: boolean;
  otherEquipment?: string;
  // Métodos de control de plagas, arvenses y enfermedades
  pestControlMethod: 'Síntesis química (calendario)' | 'Síntesis química y biológicos' | 'Plaguicidas biológicos' | 'Productos orgánicos';
  // Capacitación y uso de biopreparados
  receivedTrainingForBiopreparados: boolean;
  interestedInTraining: boolean;
  biopreparadosPestFrequency?: string;
  biopreparadosFertilizationFrequency?: string;
  // Multiplicación del material
  performsMultiplication: boolean;
  multiplicationDetail?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
