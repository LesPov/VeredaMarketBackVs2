// routes/adminZoneRouter.ts
import { Router } from 'express';
import validateRole from '../../../auth/middleware/validateRole/validateRole';
import validateToken from '../../../auth/middleware/valdiateToken/validateToken';
import { createZoneController } from '../controllers/RegisterCAmigos/createZoneController';
import { getZoneByIdController } from '../controllers/RegisterCAmigos/getZoneByIdController';
import { getAllZonesController } from '../controllers/RegisterCAmigos/getAllZonesController';

const adminZoneRouter = Router();

// Ruta para crear una zona y asignarla a un campiamigo.
// Se espera que el id del usuario (campiamigo) venga en el parámetro :userId.
adminZoneRouter.put('/zone/:id', validateToken, validateRole('admin'), createZoneController);
adminZoneRouter.get('/zone/:id', validateToken, validateRole('admin'), getZoneByIdController);
adminZoneRouter.get('/zone', validateToken, validateRole(['user', 'supervisor', 'admin']),
    getAllZonesController);


export default adminZoneRouter;
