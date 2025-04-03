// models/zoneModel.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../../../../database/connection";

/**
 * Interfaz para la Zona.
 */
export interface ZoneInterface extends Model {
  id?: number;
  name: string;
  tipoZona: 'municipio' | 'departamento' | 'vereda' | 'ciudad';
  description?: string;
  climate?: 'frio' | 'calido';
}

/**
 * Modelo de Zona.
 * Representa la tabla "zones" donde se almacena la información territorial.
 */
export const ZoneModel = sequelize.define<ZoneInterface>('zone', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipoZona: {
    type: DataTypes.ENUM('municipio', 'departamento', 'vereda', 'ciudad'),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  climate: {
    type: DataTypes.ENUM('frio', 'calido'),
    allowNull: true,
  },
}, {
  tableName: 'zone',
  timestamps: true,
});
