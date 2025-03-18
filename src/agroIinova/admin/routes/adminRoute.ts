import { Router } from "express";
import validateToken from "../../auth/middleware/valdiateToken/validateToken";
import validateRole from "../../auth/middleware/validateRole/validateRole";
import { getAllUsersController } from "../auth-users/controllers/getAllUsersController";

const adminRouter = Router();
adminRouter.get('/admin', validateToken, validateRole('admin'), (req, res) => { res.send('Bienvenido, eres un admin'); });

export default adminRouter;

