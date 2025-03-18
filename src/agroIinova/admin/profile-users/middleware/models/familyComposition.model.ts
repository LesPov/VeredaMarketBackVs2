// models/familyComposition.model.ts
import { DataTypes } from 'sequelize';
import sequelize from '../../../../../database/connection';
import { AuthModel } from '../../../../auth/middleware/models/authModel';
import { FamilyCompositionInterface } from '../interfaces/familyCompositionInterface';

/**
 * Modelo para la composición familiar y mano de obra.
 * Registra datos generales como el número de personas en el hogar,
 * dependientes, trabajadores y el tipo de mano de obra predominante.
 */
export const FamilyCompositionModel = sequelize.define<FamilyCompositionInterface>('familyComposition', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // Relación con la tabla de usuarios (Auth)
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,  // Garantiza relación 1:1
    references: {
      model: AuthModel,
      key: 'id',
    },
  },
  personsInHome: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Número de personas que viven en su hogar',
  },
  dependentPersons: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Número de personas que dependen económicamente de la producción',
  },
  workingPersons: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Número total de personas que trabajan en la unidad productiva',
  },
  predominantLabor: {
    type: DataTypes.ENUM('Familiar', 'Contratada', 'Mixta'),
    allowNull: false,
    comment: 'La mano de obra que predomina en la finca',
  },
}, {
  tableName: 'familyComposition',
  timestamps: true,
});

// Definir la asociación: cada usuario tiene una composición familiar (1:1)
AuthModel.hasOne(FamilyCompositionModel, { foreignKey: 'userId', as: 'familyComposition' });
FamilyCompositionModel.belongsTo(AuthModel, { foreignKey: 'userId', as: 'user' });

export default FamilyCompositionModel;
