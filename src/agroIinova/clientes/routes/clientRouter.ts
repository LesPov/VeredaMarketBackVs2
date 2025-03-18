import { Router } from "express";
import validateToken from "../../auth/middleware/valdiateToken/validateToken";
import validateRole from "../../auth/middleware/validateRole/validateRole";

const clientRouter = Router();
/**
 *  GET /api/user/user
 *  Ruta protegida para los usuarios normales.
 *  Privado (solo para usuarios con rol 'user')
 */
clientRouter.get('/client', validateToken, validateRole('client'), (req, res) => { res.send('Bienvenido, eres un cliente'); });


export default clientRouter;

