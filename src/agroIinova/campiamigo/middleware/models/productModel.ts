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

/**
 * Modelo para el Producto.
 * Representa la tabla 'product' que almacena los productos registrados.
 */
export const ProductModel = sequelize.define<ProductInterface>('product', {
  /** Identificador único del producto */
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  /** Nombre del producto */
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  /** Descripción del producto */
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  /** Precio del producto */
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0,
  },
  /** URL o ruta de la imagen del producto */
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  /** Ruta o URL del archivo .glb para el modelo 3D del producto */
  glbFile: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  /** URL o ruta del video del producto */
  video: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  /** Referencia al identificador del usuario dueño del producto */
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'auth', // Se relaciona con la tabla de autenticación
      key: 'id',
    },
  },
}, {
  tableName: 'product',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'name'], // Cada usuario no podrá tener dos productos con el mismo nombre
    },
  ],
});

/**
 * Establecer la relación entre AuthModel y ProductModel. 
 * Un usuario (campesino/campiamigo) puede tener muchos productos.
 */
AuthModel.hasMany(ProductModel, { foreignKey: 'userId', as: 'products' });
ProductModel.belongsTo(AuthModel, { foreignKey: 'userId' });
