import { DataTypes, Model } from "sequelize";
import sequelize from "../../../../database/connection";

/**
 * Interfaz para la Zona.
 * Se agregan los campos departamentoName, cityImage y zoneImage para complementar la información.
 */
export interface ZoneInterface extends Model {
  id?: number;
  name: string;            // Nombre del pueblo, municipio o zona
  departamentoName?: string;       // Nombre del departamento o ciudad (opcional)
  cityImage?: string;      // URL o path de la imagen de la ciudad (opcional)
  zoneImage?: string;      // URL o path de la imagen representativa de la zona (opcional)
  tipoZona: 'municipio' | 'departamento' | 'vereda' | 'ciudad';
  description?: string;
  climate?: 'frio' | 'calido';

  // Nuevos campos para los activos
  video?: string;          // Ruta o URL del video asociado a la zona
  modelPath?: string;      // Ruta o URL del modelo 3D (terreno) de la zona
  titleGlb?: string;       // Ruta o URL del archivo .glb para el título u otro asset 3D
}


/**
 * Modelo de Zona.
 * Representa la tabla "zone" donde se almacena la información territorial. 
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
    unique: 'unique_zone_departamento'
  },
  departamentoName: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Nombre del departamento o ciudad relacionado con la zona',
    unique: 'unique_zone_departamento'
  },
  cityImage: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'URL o ruta de la imagen de la ciudad'
  },
  zoneImage: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'URL o ruta de la imagen representativa de la zona'
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
  // Nuevos campos para los activos
  video: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Ruta o URL del video asociado a la zona'
  },
  modelPath: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Ruta o URL del modelo 3D (terreno) asociado a la zona'
  },
  titleGlb: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Ruta o URL del archivo .glb para el título u otro asset 3D'
  }
}, {
  tableName: 'zone',
  timestamps: true,
});
