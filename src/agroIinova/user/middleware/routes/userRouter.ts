import { Router } from "express";
import validateToken from "../../../auth/middleware/valdiateToken/validateToken";
import validateRole from "../../../auth/middleware/validateRole/validateRole";

const userRouter = Router();
userRouter.get('/user', validateToken, validateRole('user'), (req, res) => { res.send('Bienvenido, eres un admin'); });

export default userRouter;

