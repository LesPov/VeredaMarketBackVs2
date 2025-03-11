// models/socioDemographic.model.ts
import { DataTypes } from 'sequelize';
import sequelize from '../../../../database/connection';
import { AuthModel } from '../../../auth/middleware/models/authModel';

/**
 * Modelo para la información sociodemográfica del campesino.
 * Representa la tabla "socioDemographic" en la base de datos.
 */
export const SocioDemographicModel = sequelize.define('socioDemographic', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // Relación con el usuario en la tabla "auth"
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: AuthModel, // Se utiliza el modelo AuthModel para la referencia
      key: 'id',
    },
  },
  // Tiempo de residencia: años y meses
  residenceYears: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  residenceMonths: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // Autoidentificación: opciones predefinidas
  selfIdentification: {
    type: DataTypes.ENUM('Campesino(a)', 'Trabajador(a) rural', 'Habitante rural', 'Otro'),
    allowNull: false,
  },
  // Detalle para el caso "Otro" en autoidentificación (opcional)
  otherIdentification: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // Grupo étnico al que pertenece
  ethnicGroup: {
    type: DataTypes.ENUM('Indígena', 'Afrocolombiano', 'Raizales', 'ROM o gitano', 'Ninguno'),
    allowNull: false,
  },
  // Detalle del grupo étnico, si aplica (opcional)
  ethnicGroupDetail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // Indica si la persona se reconoce como persona con discapacidad
  hasDisability: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  // Detalle de la discapacidad, en caso afirmativo (opcional)
  disabilityDetail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // Indica si la persona se reconoce como víctima del conflicto armado
  conflictVictim: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  // Nivel de escolaridad completado
  educationLevel: {
    type: DataTypes.ENUM('Ninguna', 'Primaria', 'Secundaria', 'Técnico o Tecnológico', 'Profesional', 'Posgrado'),
    allowNull: false,
  },
}, {
  tableName: 'socioDemographic',
  timestamps: true,
});

export default SocioDemographicModel;
