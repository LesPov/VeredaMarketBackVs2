import { Router } from "express";
import validateToken from "../../auth/middleware/valdiateToken/validateToken";
import validateRole from "../../auth/middleware/validateRole/validateRole";
import { registerCampesinoPersonalData } from "../controllers/registercampesinos/registerCampesinosController";

const registerCampesino = Router();

/**
 * Ruta POST para registrar los datos personales de un campesino.
 * La ruta está protegida y solo es accesible para usuarios con rol 'campesino'.
 */
registerCampesino.post(
    '/client/register-campesino',
    validateToken,
    validateRole('campesino'),
    registerCampesinoPersonalData
);

export default registerCampesino;

