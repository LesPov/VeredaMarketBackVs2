import { DataTypes } from "sequelize";
import sequelize from "../../../../../database/connection";
import { AuthModel } from "../../../middleware/models/authModel";
import { UserProfileinterface } from "../interfaces/userProfileInterface";

export const userProfileModel = sequelize.define<UserProfileinterface>('userProfile', {
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
      model: 'auth',
      key: 'id',
    },
  },
  profilePicture: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  identificationType: {
    type: DataTypes.ENUM(
      'Cédula',
      'Tarjeta de Identidad',
      'DNI',
      'Pasaporte',
      'Licencia de Conducir',
      'Otro'
    ),
    allowNull: false,
  },
  identificationNumber: {
    type: DataTypes.STRING, 
    allowNull: true,
  },
  biography: {
    type: DataTypes.TEXT,
    allowNull: true,
  }, 
  direccion: { 
    type: DataTypes.TEXT,
    allowNull: true,
  },
  birthDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM('Mujer', 'Hombre', 'Otro género', 'Prefiero no declarar'),
    allowNull: false,  
  },
  status: {
    type: DataTypes.ENUM('pendiente', 'aprobado', 'rechazado'),
    allowNull: false,
    defaultValue: 'pendiente',
},
  // Nueva columna para diferenciar usuarios que aceptan pertenecer a Campiamigo
  campiamigo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

// Relaciones
AuthModel.hasOne(userProfileModel, { foreignKey: 'userId' });
userProfileModel.belongsTo(AuthModel, { foreignKey: 'userId' });
