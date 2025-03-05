import { Router } from "express";
import validateToken from "../../auth/middleware/valdiateToken/validateToken";
import validateRole from "../../auth/middleware/validateRole/validateRole";

const campesinoRouter = Router();
/**
 *  GET /api/user/user
 *  Ruta protegida para los usuarios normales.
 *  Privado (solo para usuarios con rol 'user')
 */
campesinoRouter.get('/campesino', validateToken, validateRole('campesino'), (req, res) => {
    res.send('Bienvenido, eres un campesino');
});

export default campesinoRouter;

