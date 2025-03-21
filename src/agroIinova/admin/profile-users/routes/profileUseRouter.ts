import { Router } from "express";
import validateRole from "../../../auth/middleware/validateRole/validateRole";
import validateToken from "../../../auth/middleware/valdiateToken/validateToken";

import { updateUserProfileByAdmin } from "../controllers/infoperfil/updateUserProfileByController";
import { getProfileByIdController } from "../controllers/infoperfil/getProfileByIdController ";

const adminProfileRouter = Router();

// Ruta para obtener el perfil de un usuario específico
adminProfileRouter.get('/profiles/:id', validateToken, validateRole('admin'), getProfileByIdController);

// Ruta para actualizar el perfil de un usuario específico
adminProfileRouter.put('/profile/:id', validateToken, validateRole('admin'), updateUserProfileByAdmin);

export default adminProfileRouter;
