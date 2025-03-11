import { Router } from "express";
import validateToken from "../../auth/middleware/valdiateToken/validateToken";
import validateRole from "../../auth/middleware/validateRole/validateRole";
import { registerCampesinoPersonalData } from "../../campesinos/controller/registercampesino/registerCampesinosController";
import { registerFarmProfile } from "../../campesinos/controller/registercampesino/registerFamilyCapController";
import { registerFamilyData } from "../../campesinos/controller/registercampesino/registerFamilyController";
import { registerInfrastructure } from "../../campesinos/controller/registercampesino/registerInfrastructureController";
import { registerMainProducts } from "../../campesinos/controller/registercampesino/registerMainProducts";
import { registerProductiveInfo } from "../../campesinos/controller/registercampesino/registerProductiveInfoController";
import { registerSocioDemographicData } from "../../campesinos/controller/registercampesino/registerSocioDemographicController";
import { registerTechnologyPractice } from "../../campesinos/controller/registercampesino/registerTechnologyPracticeController";

const registerCampesinoRouter = Router();

/**
 * Ruta POST para registrar los datos personales de un campesino.
 * La ruta está protegida y solo es accesible para usuarios con rol 'campesino'.
 */
registerCampesinoRouter.post(
    '/campesino/register-campesino',
    validateToken,
    validateRole('admin'),
    registerCampesinoPersonalData
);

/**
 * Ruta POST para registrar la información sociodemográfica de un campesino.
 * La ruta está protegida y solo es accesible para usuarios con rol 'campesino'.
 */
registerCampesinoRouter.post(
    '/campesino/register-campesino/socio-demographic',
    validateToken,
    validateRole('admin'),
    registerSocioDemographicData
  );

  /**
 * Ruta POST para registrar la composición familiar de un campesino.
 * Protegida y accesible solo para usuarios con rol 'campesino'.
 */
registerCampesinoRouter.post(
    '/campesino/register-campesino/family-composition',
    validateToken,
    validateRole('admin'),
    registerFamilyData
);
/**
 * Ruta POST para registrar la información del predio productivo.
 * La ruta está protegida y solo es accesible para usuarios con rol 'campesino'.
 */
registerCampesinoRouter.post(
    '/campesino/register-campesino/farm-profile',
    validateToken,
    validateRole('admin'),
    registerFarmProfile
  );

  registerCampesinoRouter.post(
    '/campesino/register-campesino/infrastructure',
    validateToken,
    validateRole('admin'),
    registerInfrastructure
  );

/**
 * Ruta POST para registrar la información productiva.
 * La ruta está protegida y solo es accesible para usuarios con rol 'campesino'.
 */
registerCampesinoRouter.post(
    '/campesino/register-campesino/productive-info',
    validateToken,
    validateRole('admin'),
    registerProductiveInfo
  );

  /**
 * Ruta POST para registrar los 5 principales productos.
 * La ruta está protegida y solo es accesible para usuarios con rol 'campesino'.
 */
  registerCampesinoRouter.post(
    '/campesino/register-campesino/main-products',
    validateToken,
    validateRole('admin'),
    registerMainProducts
  );

  /**
 * Ruta POST para registrar la información de Tecnología y Prácticas Productivas.
 * La ruta está protegida y solo es accesible para usuarios con rol 'campesino'.
 */
  registerCampesinoRouter.post(
  '/campesino/register-campesino/technology-practice',
  validateToken,
  validateRole('admin'),
  registerTechnologyPractice
);

export default registerCampesinoRouter;

  