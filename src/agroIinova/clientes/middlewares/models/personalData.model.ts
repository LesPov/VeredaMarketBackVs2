import { DataTypes } from 'sequelize';
import sequelize from '../../../../database/connection';
import { AuthModel } from '../../../auth/middleware/models/authModel';
import { PersonalDataInterface } from '../interfaces/personalDataInterface';

export const PersonalDataModel = sequelize.define<PersonalDataInterface>('personalDataModel', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    // Clave foránea que relaciona con la tabla "auth"
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: AuthModel, // Se hace referencia al modelo de autenticación
      key: 'id',
    },
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,  // Se asegura que el nombre completo sea único
  },
  identificationNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,  // Se asegura que el número de identificación sea único
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
  birthDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM('Mujer', 'Hombre', 'Otro género', 'Prefiero no declarar'),
    allowNull: false, 
  },

  photo: {  
    type: DataTypes.STRING,
    allowNull: true, 
  },
}, { 
  tableName: 'personalData',
  timestamps: true,
});

// Definir las asociaciones entre modelos
AuthModel.hasOne(PersonalDataModel, { foreignKey: 'userId' });
PersonalDataModel.belongsTo(AuthModel, { foreignKey: 'userId' });
