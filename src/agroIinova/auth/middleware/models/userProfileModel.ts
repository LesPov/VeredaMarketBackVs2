import { DataTypes } from "sequelize";
import sequelize from "../../../../database/connection";
import { UserProfileinterface } from "../interfaces/userProfileInterface";
import { AuthModel } from "./authModel";

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
    // Se definen los tipos de identificación comunes
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
    allowNull: false,
    unique: true,  // Se asegura que el número de identificación sea único
  },
  biography: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  direccion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM('Mujer', 'Hombre', 'Otro género', 'Prefiero no declarar'),
    allowNull: false, 
  },
  
status: {
    type: DataTypes.ENUM('Activado', 'Desactivado'), // Define un enum para limitar los valores posibles
    allowNull: false,
    defaultValue: 'Activado', // Puedes establecer el valor predeterminado según tus necesidades
  },
});

// Relación entre Auth (usuario) y UserProfile (perfil de usuario)
AuthModel.hasOne(userProfileModel, { foreignKey: 'userId' });
userProfileModel.belongsTo(AuthModel, { foreignKey: 'userId' });
