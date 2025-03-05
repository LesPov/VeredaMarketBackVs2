import { Model } from "sequelize";

export interface InfrastructureInterface extends Model {
  id?: number;
  userId: number;
  // Servicios de la vivienda
  hasElectricity: boolean;
  hasAcueduct: boolean;
  hasGas: boolean;
  hasInternet: boolean;
  hasSewer: boolean;
  hasPublicLighting: boolean;
  otherService?: string;
  // Condiciones de vías de acceso
  mainRoute: 'Pavimentada' | 'En afirmado' | 'Herradura' | 'Adoquín' | 'En afirmado con placa huella';
  secondaryRoute: 'Pavimentada' | 'En afirmado' | 'Herradura' | 'Adoquín' | 'En afirmado con placa huella';
  tertiaryRoute: 'Pavimentada' | 'En afirmado' | 'Herradura' | 'Adoquín' | 'En afirmado con placa huella';
  // Fuentes de agua y sistema de riego
  waterSource: 'Distrito de riego' | 'Nacimiento' | 'Quebrada' | 'Río' | 'Reservorio' | 'No cuenta' | 'Otro';
  irrigationSystemDetail?: string;
  hasIrrigationSystem: boolean;
  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}
