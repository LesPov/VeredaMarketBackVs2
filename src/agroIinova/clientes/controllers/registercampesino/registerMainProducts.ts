import { Response } from 'express';
 
import { CustomRequest } from '../../../auth/middleware/valdiateToken/validateToken';
import { errorMessages } from '../../../auth/middleware/errors/errorMessages';
import MainProductModel from '../../middlewares/models/mainProduct.model';
import ProductiveInfoModel from '../../middlewares/models/productiveInfo.model';

/**
 * Asegura que el usuario esté autenticado y retorna su userId.
 * Si no lo está, responde con error y detiene el flujo.
 */
const ensureAuthenticated = (req: CustomRequest, res: Response): number => {
  const userId = req.user ? req.user.userId : null;
  if (!userId) {
    res.status(401).json({ msg: 'Usuario no autenticado' });
    throw new Error("Usuario no autenticado");
  }
  return userId;
};

/**
 * Valida que los datos de un producto sean correctos.
 */
const validateMainProductData = (product: any): string[] => {
  const errors: string[] = [];
  
  if (!product.productName || typeof product.productName !== 'string') {
    errors.push("El nombre del producto es obligatorio y debe ser una cadena de texto.");
  }
  if (product.averageMonthlyQuantity === undefined || isNaN(Number(product.averageMonthlyQuantity))) {
    errors.push("La cantidad promedio mensual debe ser un número válido.");
  }
  if (!product.unit || typeof product.unit !== 'string') {
    errors.push("La unidad de medida es obligatoria y debe ser una cadena de texto.");
  }
  
  return errors;
};

/**
 * Procesa los errores de validación y responde al cliente.
 */
const processValidationErrors = (errors: string[], res: Response): void => {
  if (errors.length > 0) {
    res.status(400).json({
      msg: errors,
      error: 'Error en la validación de los datos'
    });
    throw new Error("Input validation failed");
  }
};

/**
 * Verifica si ya existen registros de productos principales para el productiveInfoId.
 * Retorna true y responde con error si ya existe.
 */
const verifyMainProductsExist = async (productiveInfoId: number, res: Response): Promise<boolean> => {
  const existingProducts = await MainProductModel.findOne({ where: { productiveInfoId } });
  if (existingProducts) {
    res.status(400).json({
      msg: 'Los productos principales ya han sido registrados para la información productiva.',
      error: 'Registro duplicado.'
    });
    return true;
  }
  return false;
};

/**
 * Maneja los errores generales del servidor.
 */
const processServerError = (error: any, res: Response): void => {
  console.error("Error en el controlador registerMainProducts:", error);
  if (!res.headersSent) {
    res.status(500).json({
      msg: error.message || errorMessages.databaseError,
      error,
    });
    throw new Error("Controller registerMainProducts error");
  }
};

/**
 * Envía una respuesta exitosa al cliente.
 */
const sendSuccessResponse = (message: string, res: Response): void => {
  res.status(200).json({ msg: message });
};

/**
 * Controlador para registrar los 5 principales productos.
 * Se espera recibir en el body:
 * {
 *    "mainProducts": [
 *      { "productName": "Leche cruda", "averageMonthlyQuantity": 100, "unit": "litros" },
 *      { "productName": "Carne", "averageMonthlyQuantity": 50, "unit": "kg" },
 *      { "productName": "Cereales", "averageMonthlyQuantity": 200, "unit": "kg" },
 *      { "productName": "Hortalizas", "averageMonthlyQuantity": 150, "unit": "kg" },
 *      { "productName": "Frutales", "averageMonthlyQuantity": 80, "unit": "kg" }
 *    ]
 * }
 */
export const registerMainProducts = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    // 1. Verificar autenticación
    const userId = ensureAuthenticated(req, res);
    
    // 2. Obtener la información productiva asociada al usuario
    const productiveInfo = await ProductiveInfoModel.findOne({ where: { userId } });
    if (!productiveInfo) {
      res.status(400).json({
        msg: 'Primero debe registrar la información productiva.',
        error: 'Información productiva no encontrada.'
      });
      return;
    }
    
    const productiveInfoId = productiveInfo.getDataValue('id');
    
    // 3. Verificar si ya existen productos registrados para este productiveInfo
    if (await verifyMainProductsExist(productiveInfoId, res)) return;
    
    // 4. Extraer el arreglo de productos del body
    const { mainProducts } = req.body;
    if (!mainProducts || !Array.isArray(mainProducts) || mainProducts.length !== 5) {
      res.status(400).json({
        msg: 'Debe enviar exactamente 5 productos principales en el arreglo "mainProducts".',
        error: 'Arreglo de productos inválido.'
      });
      return;
    }
    
    // 5. Validar cada producto y acumular errores
    const allErrors: string[] = [];
    mainProducts.forEach((product: any, index: number) => {
      const errors = validateMainProductData(product);
      if (errors.length > 0) {
        allErrors.push(`Producto ${index + 1}: ${errors.join(', ')}`);
      }
    });
    processValidationErrors(allErrors, res);
    
    // 6. Registrar los productos en la base de datos (bulk create)
    await MainProductModel.bulkCreate(
      mainProducts.map((product: any) => ({
        productiveInfoId,
        productName: product.productName,
        averageMonthlyQuantity: product.averageMonthlyQuantity,
        unit: product.unit
      }))
    );
    
    // 7. Enviar respuesta exitosa
    sendSuccessResponse("Productos principales registrados exitosamente.", res);
  } catch (error: any) {
    processServerError(error, res);
  }
};
