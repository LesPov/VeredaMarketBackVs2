import { DataTypes } from 'sequelize';
import sequelize from '../../../../../database/connection';
import { MainProductInterface } from '../interfaces/mainProduct.interface';
import ProductiveInfoModel from './productiveInfo.model';

export const MainProductModel = sequelize.define<MainProductInterface>('MainProductModel', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  productiveInfoId: {
    // Relaciona con la tabla "productiveInfo"
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'productiveInfo', // Debe coincidir con el nombre de la tabla de la información productiva
      key: 'id',
    },
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  averageMonthlyQuantity: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Unidad de medida (ej. kg, litros, etc.)',
  },
}, {
  tableName: 'mainProduct',
  timestamps: true,
});

export default MainProductModel;
// Un registro de ProductiveInfo puede tener muchos MainProduct (los 5 principales productos)
ProductiveInfoModel.hasMany(MainProductModel, { foreignKey: 'productiveInfoId' });

// Cada MainProduct pertenece a un registro de ProductiveInfo
MainProductModel.belongsTo(ProductiveInfoModel, { foreignKey: 'productiveInfoId' });