import { Router } from "express";
import validateToken from "../../middleware/valdiateToken/validateToken";
import validateRole from "../../middleware/validateRole/validateRole";
import { getProfileController } from "../controller/cosnultar/getprofile";
import { updateProfileController } from "../controller/register/updateProfileController";

const registerPersonalData = Router();


registerPersonalData.put( 
    '/client/update-profile',
    validateToken,
    validateRole('client'),
    updateProfileController
);
registerPersonalData.get( 
    '/client/me',
    validateToken,
    validateRole('client'),
    getProfileController
);

export default registerPersonalData; 

