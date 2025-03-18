import { DataTypes } from 'sequelize';
import sequelize from '../../../../../database/connection';
import { ProductiveInfoInterface } from '../interfaces/productiveInfo.interface';

export const ProductiveInfoModel = sequelize.define<ProductiveInfoInterface>('ProductiveInfoModel', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    // Relación con la tabla 'auth'
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'auth', // Debe coincidir con el nombre de la tabla de autenticación
      key: 'id',
    },
  },
  economicActivity: {
    type: DataTypes.ENUM('Agrícola', 'Pecuaria', 'Agropecuaria', 'Silvopastoril', 'Agrosilvopastoril'),
    allowNull: false,
  },
  agroIncomePercentage: {
    type: DataTypes.ENUM('0-25%', '25-50%', '50-75%', 'Más de 75%'),
    allowNull: false,
  },
  autoconsumoPercentage: {
    type: DataTypes.ENUM('0-25%', '25-50%', '50-75%', 'Más de 75%'),
    allowNull: false,
  },
  consumptionFrequency: {
    type: DataTypes.ENUM('Diariamente', 'Semanalmente', 'Mensualmente', 'Rara vez'),
    allowNull: false,
  },
  consumptionChange: {
    type: DataTypes.ENUM('Ha aumentado', 'Ha disminuido', 'Se ha mantenido'),
    allowNull: false,
  },
}, {
  tableName: 'productiveInfo',
  timestamps: true,
});

export default ProductiveInfoModel;
