import { Router } from "express";
import validateRole from "../../../auth/middleware/validateRole/validateRole";
import validateToken from "../../../auth/middleware/valdiateToken/validateToken";
import { getAllUsersController } from "../controllers/getAllUsersController";
import { updateUserController } from "../controllers/updateUserController";

const adminAccountRouter = Router();

// Ruta para obtener todos los usuarios (cuentas)
adminAccountRouter.get('/accounts', validateToken, validateRole('admin'), getAllUsersController);

// Ruta para actualizar datos de la cuenta (username, email, rol y la imagen del perfil)
adminAccountRouter.put('/account/:id', validateToken, validateRole('admin'), updateUserController);

export default adminAccountRouter;
