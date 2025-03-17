import { Router } from "express";
import validateToken from "../../auth/middleware/valdiateToken/validateToken";
import validateRole from "../../auth/middleware/validateRole/validateRole";
import { getAllUsersController } from "../controllers/getAllUsersController";

const adminRouter = Router();
// Ruta para que el admin consulte todos los usuarios
adminRouter.get('/users', validateToken, validateRole('admin'), getAllUsersController);


export default adminRouter;

