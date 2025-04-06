// routes/adminZoneRouter.ts
import { Router } from 'express';
import validateRole from '../../../auth/middleware/validateRole/validateRole';
import validateToken from '../../../auth/middleware/valdiateToken/validateToken';
import { createZoneController } from '../controllers/RegisterCAmigos/createZoneController';
import { getZoneByIdController } from '../controllers/RegisterCAmigos/getZoneByIdController';
import { getAllZonesController } from '../controllers/RegisterCAmigos/getAllZonesController';
import { updateIndicatorColor } from '../controllers/RegisterCAmigos/utils/indicador/indicatorController';
import { getIndicatorByUserIdController } from '../controllers/RegisterCAmigos/utils/indicador/getIndicatorByUserIdController';
import { updateIndicatorPosition } from '../controllers/RegisterCAmigos/utils/indicador/indicatorPositionController';

const adminZoneRouter = Router();

// Ruta para crear una zona y asignarla a un campiamigo.
// Se espera que el id del usuario (campiamigo) venga en el parámetro :userId.
adminZoneRouter.put('/zone/:id', validateToken, validateRole('admin'), createZoneController);
adminZoneRouter.get('/zone/:id', validateToken, validateRole('admin'), getZoneByIdController);
adminZoneRouter.get('/zone', validateToken, validateRole(['user', 'supervisor', 'admin']),
    getAllZonesController);
adminZoneRouter.put(
    '/zones/indicator-colors/:id',
    validateToken, validateRole('admin'),
    updateIndicatorColor
);
adminZoneRouter.get(
    '/zones/indicator/:id',
    validateToken,
    validateRole(['admin', 'supervisor', 'user']),
    getIndicatorByUserIdController
  );
  // En routes/adminZoneRouter.ts
adminZoneRouter.put(
    '/zones/indicator-position/:id',
    validateToken, validateRole('admin'),
    updateIndicatorPosition
  );
  
export default adminZoneRouter;
