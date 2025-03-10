import { Model } from "sequelize";

export interface MainProductInterface extends Model {
  id?: number;
  productiveInfoId: number; // Relación con la tabla productiveInfo
  productName: string;      // Nombre del producto
  averageMonthlyQuantity: number; // Cantidad promedio mensual
  unit: string;             // Unidad de medida (ej. kg, litros, etc.)
  createdAt?: Date;
  updatedAt?: Date;
}
