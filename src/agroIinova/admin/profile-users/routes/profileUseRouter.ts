import { Router } from "express";
import validateRole from "../../../auth/middleware/validateRole/validateRole";
import validateToken from "../../../auth/middleware/valdiateToken/validateToken";

import { getProfileByIdController } from "../controllers/infoperfil/getProfileByIdController ";
import { getSociodemograficaController } from "../controllers/sociodemografica/getSociodemofragicaController";



const adminProfileUsersRouter = Router();
adminProfileUsersRouter.get('/profile/:id', validateToken, validateRole('admin'), getProfileByIdController);
// Ruta para obtener la información sociodemográfica de un usuario por ID
adminProfileUsersRouter.get('/sociodemographic/:id', validateToken, validateRole('admin'), getSociodemograficaController);

export default adminProfileUsersRouter;

