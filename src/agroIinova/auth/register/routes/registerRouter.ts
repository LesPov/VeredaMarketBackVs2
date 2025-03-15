
import { Router } from "express";
import { newUser } from "../controllers/registerController";

const registerRouter = Router();
// Rutas existentes para registro 
/**
 * POST /api/user/register
 *  Ruta para registrar un nuevo usuario.
 *  Público
 */
registerRouter.post('/register', newUser);
export default registerRouter;
  