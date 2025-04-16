// routes/assetsRouter.ts
import { Router } from 'express';
import validateToken from '../../../../../../../auth/middleware/valdiateToken/validateToken';
import validateRole from '../../../../../../../auth/middleware/validateRole/validateRole';
import { createProductController } from '../postProductController';
import { getUserProductsController } from '../getProductCountController';
import { getAllProductsController } from '../getAllProductsController';

const productosRouter = Router();

// Ruta para subir activos (máx: 3 imágenes y 2 modelos 3D)
// Puedes ajustar la validación de token y role según lo requieras (por ejemplo, 'admin' o 'user')
productosRouter.post('/product/:id', validateToken, validateRole('admin'), createProductController);
productosRouter.get('/product/:id/count', validateToken, validateRole('admin'), getUserProductsController);
// Cambiar de '/products/all' a 'products/all' (montado bajo /campiamigo/product)
productosRouter.get('/products/all', validateToken, validateRole('admin'), getAllProductsController);

export default productosRouter;
