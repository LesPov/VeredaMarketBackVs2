import { Router } from 'express';
import validateRole from '../../../auth/middleware/validateRole/validateRole';
import validateToken from '../../../auth/middleware/valdiateToken/validateToken';
import { createZoneController } from '../controllers/RegisterCAmigos/utils/zone/createZoneController';
import { getZoneByIdController } from '../controllers/RegisterCAmigos/utils/zone/getZoneByIdController';
import { getAllZonesController } from '../controllers/RegisterCAmigos/utils/zone/getAllZonesController';
import { updateIndicatorColor } from '../controllers/RegisterCAmigos/utils/indicador/indicatorController';
import { getIndicatorByUserIdController } from '../controllers/RegisterCAmigos/utils/indicador/getIndicatorByUserIdController';
import { updateIndicatorPosition } from '../controllers/RegisterCAmigos/utils/indicador/indicatorPositionController';
import { selectExistingZoneController } from '../controllers/RegisterCAmigos/utils/zone/selectExistingZoneController';
import { deleteZoneController } from '../controllers/RegisterCAmigos/utils/zone/deleteZoneController ';

const adminZoneRouter = Router();

// Ruta para crear una zona
adminZoneRouter.post('/zones', validateToken, validateRole('admin'), createZoneController);

// Rutas adicionales de zona (consulta, actualización, eliminación)
adminZoneRouter.get('/zone/:id', validateToken, validateRole(['user', 'supervisor', 'admin']), getZoneByIdController);
adminZoneRouter.get('/zone', validateToken, validateRole(['user', 'supervisor', 'admin']), getAllZonesController);
adminZoneRouter.put('/zones/indicator-colors/:id', validateToken, validateRole('admin'), updateIndicatorColor);
adminZoneRouter.get('/zones/indicator/:id', validateToken, validateRole(['admin', 'supervisor', 'user']), getIndicatorByUserIdController);
adminZoneRouter.put('/zones/indicator-position/:id', validateToken, validateRole('admin'), updateIndicatorPosition);
adminZoneRouter.put('/user/:id/zone', validateToken, validateRole('admin'), selectExistingZoneController);
adminZoneRouter.delete('/zones/:id', validateToken, validateRole('admin'), deleteZoneController);

export default adminZoneRouter;
