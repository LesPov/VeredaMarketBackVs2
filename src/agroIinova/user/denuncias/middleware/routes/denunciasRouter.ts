// routes/denuncias.router.ts
import { Router } from 'express';
import validateToken from '../../../../auth/middleware/valdiateToken/validateToken';
import validateRole from '../../../../auth/middleware/validateRole/validateRole';

const denunciasRouter = Router();

// Ejemplo de ruta para obtener denuncias (sólo usuarios con rol 'user', por ejemplo)
denunciasRouter.get('/', validateToken, validateRole('user'), (req, res) => {
  res.send('Listado de denuncias');
});

export default denunciasRouter;
