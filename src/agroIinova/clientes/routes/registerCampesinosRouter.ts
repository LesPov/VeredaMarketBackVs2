import { Router } from "express";
import validateToken from "../../auth/middleware/valdiateToken/validateToken";
import validateRole from "../../auth/middleware/validateRole/validateRole";
import { registerCampesinoPersonalData } from "../controllers/registercampesino/registerCampesinosController";
import { registerFarmProfile } from "../controllers/registercampesino/registerFamilyCapController";
import { registerFamilyData } from "../controllers/registercampesino/registerFamilyController";
import { registerInfrastructure } from "../controllers/registercampesino/registerInfrastructureController";
import { registerMainProducts } from "../controllers/registercampesino/registerMainProducts";
import { registerProductiveInfo } from "../controllers/registercampesino/registerProductiveInfoController";
import { registerSocioDemographicData } from "../controllers/registercampesino/registerSocioDemographicController";
import { registerTechnologyPractice } from "../controllers/registercampesino/registerTechnologyPracticeController";

const registerCampesinoRouter = Router();

/**
 * Ruta POST para registrar los datos personales de un campesino.
 * La ruta está protegida y solo es accesible para usuarios con rol 'campesino'.
 */
registerCampesinoRouter.post(
    '/client/register-campesino',
    validateToken,
    validateRole('client'),
    registerCampesinoPersonalData
);

/**
 * Ruta POST para registrar la información sociodemográfica de un campesino.
 * La ruta está protegida y solo es accesible para usuarios con rol 'campesino'.
 */
registerCampesinoRouter.post(
    '/client/register-campesino/socio-demographic',
    validateToken,
    validateRole('client'),
    registerSocioDemographicData
  );

  /**
 * Ruta POST para registrar la composición familiar de un campesino.
 * Protegida y accesible solo para usuarios con rol 'campesino'.
 */
registerCampesinoRouter.post(
    '/client/register-campesino/family-composition',
    validateToken,
    validateRole('client'),
    registerFamilyData
);
/**
 * Ruta POST para registrar la información del predio productivo.
 * La ruta está protegida y solo es accesible para usuarios con rol 'campesino'.
 */
registerCampesinoRouter.post(
    '/client/register-campesino/farm-profile',
    validateToken,
    validateRole('client'),
    registerFarmProfile
  );

  registerCampesinoRouter.post(
    '/client/register-campesino/infrastructure',
    validateToken,
    validateRole('client'),
    registerInfrastructure
  );

/**
 * Ruta POST para registrar la información productiva.
 * La ruta está protegida y solo es accesible para usuarios con rol 'campesino'.
 */
registerCampesinoRouter.post(
    '/client/register-campesino/productive-info',
    validateToken,
    validateRole('client'),
    registerProductiveInfo
  );

  /**
 * Ruta POST para registrar los 5 principales productos.
 * La ruta está protegida y solo es accesible para usuarios con rol 'campesino'.
 */
  registerCampesinoRouter.post(
    '/client/register-campesino/main-products',
    validateToken,
    validateRole('client'),
    registerMainProducts
  );

  /**
 * Ruta POST para registrar la información de Tecnología y Prácticas Productivas.
 * La ruta está protegida y solo es accesible para usuarios con rol 'campesino'.
 */
  registerCampesinoRouter.post(
  '/client/register-campesino/technology-practice',
  validateToken,
  validateRole('client'),
  registerTechnologyPractice
);

export default registerCampesinoRouter;

  