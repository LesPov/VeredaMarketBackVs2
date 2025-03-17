import { Router } from "express";
import validateToken from "../../middleware/valdiateToken/validateToken";
import validateRole from "../../middleware/validateRole/validateRole";
import { getProfileController } from "../controller/cosnultar/getprofile";
import { updateProfileController } from "../controller/register/updateProfileController";
import { updateMinimalProfileController } from "../controller/register/updateMinimalProfileController ";

const registerPersonalData = Router();


registerPersonalData.put( 
    '/client/update-profile',
    validateToken,
    validateRole(['client', 'campesino', 'admin']),
    updateProfileController
);
registerPersonalData.put(
    '/client/update-minimal-profile',
    validateToken,
    validateRole('client'),
    updateMinimalProfileController
  );
registerPersonalData.get( 
    '/client/me',
    validateToken,
    validateRole(['client', 'campesino', 'admin']),
    getProfileController
);

export default registerPersonalData; 

 