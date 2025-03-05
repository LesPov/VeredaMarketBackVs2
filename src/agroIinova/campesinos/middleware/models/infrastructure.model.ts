import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../../database/connection';
import { InfrastructureInterface } from '../interfaces/infrastructure.interface';

export const InfrastructureModel = sequelize.define<InfrastructureInterface>('InfrastructureModel', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    // Relación con la tabla de autenticación.
    references: {
      model: 'auth', // Asegúrate de que el nombre coincide con el definido en AuthModel.
      key: 'id'
    }
  },
  // Servicios de la vivienda
  hasElectricity: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  hasAcueduct: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  hasGas: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  hasInternet: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  hasSewer: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  hasPublicLighting: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  otherService: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // Condiciones de vías de acceso
  mainRoute: {
    type: DataTypes.ENUM('Pavimentada', 'En afirmado', 'Herradura', 'Adoquín', 'En afirmado con placa huella'),
    allowNull: false,
  },
  secondaryRoute: {
    type: DataTypes.ENUM('Pavimentada', 'En afirmado', 'Herradura', 'Adoquín', 'En afirmado con placa huella'),
    allowNull: false,
  },
  tertiaryRoute: {
    type: DataTypes.ENUM('Pavimentada', 'En afirmado', 'Herradura', 'Adoquín', 'En afirmado con placa huella'),
    allowNull: false,
  },
  // Fuentes de agua y sistema de riego
  waterSource: {
    type: DataTypes.ENUM('Distrito de riego', 'Nacimiento', 'Quebrada', 'Río', 'Reservorio', 'No cuenta', 'Otro'),
    allowNull: false,
  },
  irrigationSystemDetail: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Detalle del sistema de riego en caso afirmativo',
  },
  hasIrrigationSystem: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: 'infrastructure',
  timestamps: true,
});

export default InfrastructureModel;
