import { Router } from "express";
import validateToken from "../../auth/middleware/valdiateToken/validateToken";
import validateRole from "../../auth/middleware/validateRole/validateRole";
import { registerCampesinoPersonalData } from "../controller/register/registerCampesinosController";
import { registerSocioDemographicData } from "../controller/register/registerSocioDemographicController";
import { registerFamilyData } from "../controller/register/registerFamilyController";
import { registerFarmProfile } from "../controller/register/registerFamilyCapController";
import { registerInfrastructure } from "../controller/register/registerInfrastructureController";
import { registerProductiveInfo } from "../controller/register/registerProductiveInfoController";
import { registerMainProducts } from "../controller/register/registerMainProducts";

const registerCampesinoRouter = Router();

/**
 * Ruta POST para registrar los datos personales de un campesino.
 * La ruta está protegida y solo es accesible para usuarios con rol 'campesino'.
 */
registerCampesinoRouter.post(
    '/campesino/register',
    validateToken,
    validateRole('campesino'),
    registerCampesinoPersonalData
);

/**
 * Ruta POST para registrar la información sociodemográfica de un campesino.
 * La ruta está protegida y solo es accesible para usuarios con rol 'campesino'.
 */
registerCampesinoRouter.post(
    '/campesino/register/socio-demographic',
    validateToken,
    validateRole('campesino'),
    registerSocioDemographicData
  );

  /**
 * Ruta POST para registrar la composición familiar de un campesino.
 * Protegida y accesible solo para usuarios con rol 'campesino'.
 */
registerCampesinoRouter.post(
    '/campesino/register/family-composition',
    validateToken,
    validateRole('campesino'),
    registerFamilyData
);
/**
 * Ruta POST para registrar la información del predio productivo.
 * La ruta está protegida y solo es accesible para usuarios con rol 'campesino'.
 */
registerCampesinoRouter.post(
    '/campesino/register/farm-profile',
    validateToken,
    validateRole('campesino'),
    registerFarmProfile
  );

  registerCampesinoRouter.post(
    '/campesino/register/infrastructure',
    validateToken,
    validateRole('campesino'),
    registerInfrastructure
  );

/**
 * Ruta POST para registrar la información productiva.
 * La ruta está protegida y solo es accesible para usuarios con rol 'campesino'.
 */
registerCampesinoRouter.post(
    '/campesino/register/productive-info',
    validateToken,
    validateRole('campesino'),
    registerProductiveInfo
  );

  /**
 * Ruta POST para registrar los 5 principales productos.
 * La ruta está protegida y solo es accesible para usuarios con rol 'campesino'.
 */
  registerCampesinoRouter.post(
    '/campesino/register/main-products',
    validateToken,
    validateRole('campesino'),
    registerMainProducts
  );
export default registerCampesinoRouter;

  