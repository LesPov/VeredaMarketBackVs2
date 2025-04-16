// models/productModel.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../../database/connection';
import { AuthModel } from '../../../auth/middleware/models/authModel';

/**
 * Interfaz para el Producto.
 * Define las propiedades que tendrá cada registro de producto asociado a un campesino/campiamigo.
 */
export interface ProductInterface extends Model {
  id?: number;
  /** Nombre del producto (único para cada usuario/campesino) */
  name: string;
  /** Descripción del producto */
  description?: string;
  /** Precio del producto */
  price: number;
  /** URL o ruta de la imagen del producto */
  image?: string;
  /** Ruta o URL del archivo .glb asociado al modelo 3D del producto */
  glbFile?: string;
  /** URL o ruta del video del producto (opcional) */
  video?: string;
  /** Identificador del usuario (campesino/campiamigo) dueño del producto */
  userId: number;
}


export const ProductModel = sequelize.define('product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
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
    // OJO: aquí userId apunta a la tabla auth
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'auth',
        key: 'id',
      },
    },
  }, {
    tableName: 'product',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'name'],
      },
    ],
  });
  
  // Relación 1:N con Auth
  AuthModel.hasMany(ProductModel, { foreignKey: 'userId', as: 'products' });
  ProductModel.belongsTo(AuthModel, { foreignKey: 'userId' });