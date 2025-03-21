import { Router } from 'express';
import validateToken from '../../../auth/middleware/valdiateToken/validateToken';
import validateRole from '../../../auth/middleware/validateRole/validateRole';
import { creaTiposDenunciaAnonimas } from '../../denuncias/tiposDeDenuncias/controllers/tiposDeDenunciasController';
import { creaSubtipoDenuncia } from '../../denuncias/subtiposDeDenuncias/controller/subtiposDenunciasControlelr';
import { getTiposDenunciaAnonimas } from '../../denuncias/tiposDeDenuncias/controllers/getTiposDeDenuncias';
import { getSubtiposDenuncia } from '../../denuncias/subtiposDeDenuncias/controller/getSubtipoDenunciController';

const tipoYSubtipoDenunciaRouter = Router();

// Ruta para crear un tipo de denuncia (POST)
tipoYSubtipoDenunciaRouter.post(
  '/agregar_tipos', 
  validateToken, 
  validateRole('admin'), 
  creaTiposDenunciaAnonimas
);

// Ruta GET para consultar los tipos de denuncias anónimas (GET)
tipoYSubtipoDenunciaRouter.get('/tipos', getTiposDenunciaAnonimas);
tipoYSubtipoDenunciaRouter.get('/subtipos', getSubtiposDenuncia);

// Ruta para crear un subtipo de denuncia (POST)
tipoYSubtipoDenunciaRouter.post(
  '/agregar_subtipo', 
  validateToken, 
  validateRole('admin'), 
  creaSubtipoDenuncia
);

export default tipoYSubtipoDenunciaRouter;
