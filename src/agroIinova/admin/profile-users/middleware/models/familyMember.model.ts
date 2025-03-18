// models/familyMember.model.ts
import { DataTypes } from 'sequelize';

import { FamilyMemberInterface } from '../interfaces/familyMemberInterface';
import sequelize from '../../../../../database/connection';
import { AuthModel } from '../../../../auth/middleware/models/authModel';

/**
 * Modelo para la información de miembros familiares.
 * Almacena detalles como relación, género, edad, nivel educativo,
 * grupo étnico, discapacidad y rol en la unidad productiva.
 */
export const FamilyMemberModel = sequelize.define<FamilyMemberInterface>('familyMember', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // Relación con la tabla de usuarios (Auth)
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // Referencia a la tabla 'auth'
    references: {
      model: AuthModel,
      key: 'id',
    },
  },
  relationship: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Ej: cónyuge, hijo/a, etc.',
  },
  gender: { 
    type: DataTypes.ENUM('Mujer', 'Hombre', 'Otro', 'Prefiero no declarar'),
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  educationLevel: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ethnicGroup: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  hasDisability: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  disabilityDetail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  roleInProduction: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Rol en la unidad productiva',
  },
}, {
  tableName: 'familyMember',
  timestamps: true,
});

// Asociaciones: Un usuario (AuthModel) puede tener muchos miembros familiares.
AuthModel.hasMany(FamilyMemberModel, { foreignKey: 'userId', as: 'familyMembers' });
FamilyMemberModel.belongsTo(AuthModel, { foreignKey: 'userId', as: 'user' });

export default FamilyMemberModel;
