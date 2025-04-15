import { Router } from "express";
import validateToken from "../../middleware/valdiateToken/validateToken";
import validateRole from "../../middleware/validateRole/validateRole";
import { getProfileController } from "../controller/cosnultar/getprofile";
import { updateProfileController } from "../controller/actualizar/updateProfileController";
import { updateMinimalProfileController } from "../controller/actualizar/updateMinimalProfileController ";

const registerPersonalData = Router();


registerPersonalData.put(
    '/user/update-profile',
    validateToken,
    validateRole(['user', 'supervisor', 'admin']),
    updateProfileController
);
registerPersonalData.put(
    '/user/update-minimal-profile',
    validateToken,
    validateRole('user'),
    updateMinimalProfileController
);
registerPersonalData.get(
    '/user/me',
    validateToken,
    validateRole(['user', 'supervisor', 'admin']),
    getProfileController
);

export default registerPersonalData;

