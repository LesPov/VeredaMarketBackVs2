import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../../database/connection';
import { FarmProfileInterface } from '../interfaces/farmProfile.interface';


export const FarmProfile = sequelize.define<FarmProfileInterface>('FarmProfileModel', {
        id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'auth', // Asegúrate de que el nombre coincida con la tabla de autenticación
        key: 'id'
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vereda: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    municipality: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gpsCoordinates: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Opcional: capturado mediante GPS'
    },
    landType: {
      type: DataTypes.ENUM('Propio', 'Arriendo', 'Sana Posesión', 'Ocupación', 'Anticresis', 'Usufructo'),
      allowNull: false,
    },
    housingLocation: {
      type: DataTypes.ENUM(
        'Dentro del predio',
        'Predio colindante',
        'Predio no colindante (misma vereda)',
        'Predio no colindante (otra vereda)',
        'Predio no colindante (otro municipio)',
        'Otra'
      ),
      allowNull: false,
    },
    totalArea: {
      type: DataTypes.FLOAT,
      allowNull: false,
      comment: 'Área total en hectáreas o fanegadas',
    },
    areaPecuaria: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    areaAgricola: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    areaForestal: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    areaReservaNatural: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    tableName: 'farmProfile', 
    timestamps: true,
  }
);

export default FarmProfile;
