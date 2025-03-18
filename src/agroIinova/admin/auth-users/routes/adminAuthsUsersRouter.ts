import { Router } from "express";
import validateRole from "../../../auth/middleware/validateRole/validateRole";
import validateToken from "../../../auth/middleware/valdiateToken/validateToken";
import { getAllUsersController } from "../controllers/getAllUsersController";
import { updateUserController } from "../controllers/updateUserController";



const adminAuthsUsersRouter = Router();
adminAuthsUsersRouter.get('/usersProfile', validateToken, validateRole('admin'), getAllUsersController);
// PUT: Actualiza username, email, rol y la imagen del perfil para un usuario específico
adminAuthsUsersRouter.put('/user/:id', validateToken, validateRole('admin'), updateUserController);

export default adminAuthsUsersRouter;

