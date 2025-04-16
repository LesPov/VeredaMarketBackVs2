import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../../database/connection';
import { ZoneModel } from './zoneModel';
import { userProfileModel } from '../../../auth/profile/middleware/models/userProfileModel';

/**
 * Interfaz para los indicadores.
 * Cada registro asocia una zona y un usuario con un color y opcionalmente quién lo actualizó.
 */
export interface IndicatorInterface extends Model {
  id?: number;
  zoneId: number;
  userId: number;
  updatedBy?: number;
  color: string;
  createdAt?: Date; 
  updatedAt?: Date;
}
export const IndicatorModel = sequelize.define('indicator', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  zoneId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ZoneModel,
      key: 'id'
    }
  },
  // OJO: En este caso userId apunta a userProfile.id
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: userProfileModel,
      key: 'id'
    }
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'white'
  },
  x: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  y: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  z: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'indicator',
  timestamps: true,
});

// Relaciones
ZoneModel.hasMany(IndicatorModel, { foreignKey: 'zoneId' });
IndicatorModel.belongsTo(ZoneModel, { foreignKey: 'zoneId' });

// OJO: userProfile se relaciona 1:1 con indicator
userProfileModel.hasOne(IndicatorModel, { foreignKey: 'userId' });
IndicatorModel.belongsTo(userProfileModel, { foreignKey: 'userId' });