import { Router } from 'express';
import validateToken from '../../../../../../../auth/middleware/valdiateToken/validateToken';
import validateRole from '../../../../../../../auth/middleware/validateRole/validateRole';
import { createTagController, getUserTagsController } from '../tagController';

const tagRouter = Router();

// Crear etiqueta para un perfil de usuario
// Body: { name: string }
tagRouter.post(
  '/tag/:id',
  validateToken,
  validateRole('admin'),
  createTagController
);

// Obtener count de etiquetas de un usuario
tagRouter.get(
  '/tag/:id/count',
  validateToken,
  validateRole('admin'),
  getUserTagsController
);



export default tagRouter;
