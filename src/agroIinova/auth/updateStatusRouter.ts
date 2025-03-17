// updateStatusRouter.ts
import { Router } from "express";
import { updateStatus } from "../admin/controllers/updateStatus";
import validateToken from "./middleware/valdiateToken/validateToken";


const updateStatusRouter = Router();
updateStatusRouter.put('/', validateToken, updateStatus);

export default updateStatusRouter;
