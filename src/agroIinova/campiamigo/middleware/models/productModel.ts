// src/campiamigo/middleware/models/productModel.ts

import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../../database/connection';
import { AuthModel } from '../../../auth/middleware/models/authModel';

export interface ProductInterface extends Model {
  id?: number;
  name: string;
  subtitle?: string | null;    // ← nuevo campo
  description?: string | null;
  price: number;
  image?: string | null;
  glbFile?: string | null;
  video?: string | null;
  userId: number;
  stock: number;
  rating: number;
  reviewCount: number;
}

export const ProductModel = sequelize.define<ProductInterface>(
  'product',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Nuevo campo subtitle: texto breve opcional
    subtitle: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Subtítulo o lema breve del producto',
      validate: {
        len: [0, 255],   // opcional, hasta 255 caracteres
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
      // Getter que parsea y elimina ceros innecesarios
      get() {
        const raw = this.getDataValue('price'); 
        // raw viene como string "1000.00"
        return raw === null
          ? null
          : parseFloat(raw as unknown as string);
      }
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    glbFile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    video: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'auth', key: 'id' },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0, max: 5 }
    },
    reviewCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    }
  },
  {
    tableName: 'product',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'name'],
      },
    ],
  }
);
 
AuthModel.hasMany(ProductModel, { foreignKey: 'userId', as: 'products' });
ProductModel.belongsTo(AuthModel, { foreignKey: 'userId' });
