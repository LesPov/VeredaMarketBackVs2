import { Router } from "express";
import validateRole from "../../../auth/middleware/validateRole/validateRole";
import validateToken from "../../../auth/middleware/valdiateToken/validateToken";

import { getProfileByIdController } from "../../profile-users/controllers/getProfileByIdController ";



const adminProfileUsersRouter = Router();
adminProfileUsersRouter.get('/profile/:id', validateToken, validateRole('admin'), getProfileByIdController);

export default adminProfileUsersRouter;

