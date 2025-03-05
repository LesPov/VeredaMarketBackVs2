import { Model } from 'sequelize';

export interface FamilyCompositionInterface extends Model {
  id: number;
  userId: number;
  personsInHome: number;
  dependentPersons: number;
  workingPersons: number;
  predominantLabor: 'Familiar' | 'Contratada' | 'Mixta';
  // Si tienes timestamps activados, puedes incluirlos (opcional)
  createdAt?: Date;
  updatedAt?: Date;
}
