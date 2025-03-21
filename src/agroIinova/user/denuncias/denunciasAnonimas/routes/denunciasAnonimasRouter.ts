// routes/denunciasAnonimas.router.ts
import { Router } from 'express';
import validateToken from '../../../../auth/middleware/valdiateToken/validateToken';
import { crearDenunciaAnonimaController } from '../controllers/denunciasAnonimascontroller';

const denunciasAnonimasRouter = Router();

// Ruta para crear denuncia anónima
// Si es una denuncia anónima, quizás no requieras validar rol o lo haces de forma diferente
denunciasAnonimasRouter.post('/anonimas', validateToken, crearDenunciaAnonimaController);

export default denunciasAnonimasRouter;
