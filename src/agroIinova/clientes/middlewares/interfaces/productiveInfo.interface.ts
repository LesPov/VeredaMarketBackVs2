import { Model } from "sequelize";

export interface ProductiveInfoInterface extends Model {
  id?: number;
  userId: number;
  economicActivity: 'Agrícola' | 'Pecuaria' | 'Agropecuaria' | 'Silvopastoril' | 'Agrosilvopastoril';
  agroIncomePercentage: '0-25%' | '25-50%' | '50-75%' | 'Más de 75%';
  autoconsumoPercentage: '0-25%' | '25-50%' | '50-75%' | 'Más de 75%';
  consumptionFrequency: 'Diariamente' | 'Semanalmente' | 'Mensualmente' | 'Rara vez';
  consumptionChange: 'Ha aumentado' | 'Ha disminuido' | 'Se ha mantenido';
  createdAt?: Date;
  updatedAt?: Date;
}
