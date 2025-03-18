import { Router } from "express";
import validateRole from "../../../auth/middleware/validateRole/validateRole";
import validateToken from "../../../auth/middleware/valdiateToken/validateToken";
import { getAllUsersController } from "../controllers/getAllUsersController";
import { updateUserController } from "../controllers/updateUserController";
import { getProfileByIdController } from "../../profile-users/getProfileByIdController ";



const adminAuthsUsersRouter = Router();
adminAuthsUsersRouter.get('/usersProfile', validateToken, validateRole('admin'), getAllUsersController);
// PUT: Actualiza username, email, rol y la imagen del perfil para un usuario específico
adminAuthsUsersRouter.put('/user/:id', validateToken, validateRole('admin'), updateUserController);
adminAuthsUsersRouter.get('/profile/:id', validateToken, validateRole('admin'), getProfileByIdController);

export default adminAuthsUsersRouter;

