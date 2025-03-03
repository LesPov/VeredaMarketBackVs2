import { Router } from "express";
import validateToken from "../../auth/middleware/valdiateToken/validateToken";
import validateRole from "../../auth/middleware/validateRole/validateRole";
import { registerPersonalDataCp } from "../controller/campesinosController";

const campesinoRouter = Router();
/**
 *  GET /api/user/user
 *  Ruta protegida para los usuarios normales.
 *  Privado (solo para usuarios con rol 'user')
 */
campesinoRouter.get('/campesino', validateToken, validateRole('campesino'), (req, res) => {
    res.send('Bienvenido, eres un campesino');
});
/**
 * Ruta POST para registrar los datos personales de un campesino.
 * La ruta está protegida y solo es accesible para usuarios con rol 'campesino'.
 */
campesinoRouter.post(
    '/campesino/register',
    validateToken,
    validateRole('campesino'),
    registerPersonalDataCp
);
export default campesinoRouter;

