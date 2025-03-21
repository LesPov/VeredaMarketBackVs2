// updateStatusRouter.ts
import { Router } from "express";
import validateToken from "../../../auth/middleware/valdiateToken/validateToken";
import { updateStatus } from "../controllers/updateStatus";


const updateStatusRouter = Router();
updateStatusRouter.put('/', validateToken, updateStatus);

export default updateStatusRouter;
