// updateStatusRouter.ts
import { Router } from "express";
import validateToken from "../../middleware/valdiateToken/validateToken";
import { updateStatus } from "../../../admin/auth-users/controllers/updateStatus";


const updateStatusRouter = Router();
updateStatusRouter.put('/', validateToken, updateStatus);

export default updateStatusRouter;
