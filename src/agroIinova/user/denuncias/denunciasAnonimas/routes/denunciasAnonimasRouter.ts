// routes/denunciasAnonimas.router.ts
import { Router } from 'express';
import validateToken from '../../../../auth/middleware/valdiateToken/validateToken';
import { crearDenunciaAnonimaController } from '../controllers/denunciasAnonimascontroller';
import { consultarDenunciaAnonima } from '../controllers/consultas/consultaDenunciasAnonimas';
import validateRole from '../../../../auth/middleware/validateRole/validateRole';
import { consultarTodasDenunciasAnonimas } from '../../../../admin/denuncias/denunciaAnonimaAdmin/consultarTodasDenunciasAnonimas';

const denunciasAnonimasRouter = Router();

// Ruta para ver cosnultas solo para el admin :
// Nueva ruta para que el admin consulte TODAS las denuncias anónimas
denunciasAnonimasRouter.get(
    '/admin/consultas',
    validateToken,
    validateRole('admin'),
    consultarTodasDenunciasAnonimas
);
// Si es una denuncia anónima, quizás no requieras validar rol o lo haces de forma diferente
denunciasAnonimasRouter.post('/anonimas', validateToken, crearDenunciaAnonimaController);
denunciasAnonimasRouter.get('/consultas', validateToken, consultarDenunciaAnonima);

export default denunciasAnonimasRouter;
