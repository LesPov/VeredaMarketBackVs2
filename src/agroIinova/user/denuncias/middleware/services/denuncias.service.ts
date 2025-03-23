import dotenv from 'dotenv';
import express, { Application } from 'express';

import cors from 'cors';
import { TipoDenunciaModel } from '../models/tipoDenunciaModel';
import { SubtipoDenunciaModel } from '../models/subtipoDenunciaModel';
import { DenunciaAnonimaModel } from '../models/denunciasAnonimasModel';
import denunciasRouter from '../routes/denunciasRouter';
import denunciasAnonimasRouter from '../../denunciasAnonimas/routes/denunciasAnonimasRouter';
import tipoYSubtipoDenunciaRouter from '../../../middleware/routes/tipoYSubtipoDenunciaRoutes';


dotenv.config();
 
class DenunciasService {
    private app: Application;

    constructor() {
        this.app = express();
        this.middlewares(); // Aplica primero los middlewares
        this.routes();      // Luego define las rutas
        this.dbConnect();
    }

    routes() {
        this.app.use('/denuncias',denunciasRouter, denunciasAnonimasRouter,tipoYSubtipoDenunciaRouter, );
    }

    middlewares() {
        this.app.use(express.json());
        this.app.use(cors({
        }));
        this.app.options('*', cors());
    }

    async dbConnect() {
        try {
            await TipoDenunciaModel.sync();
            await SubtipoDenunciaModel.sync();
            
            await DenunciaAnonimaModel.sync();
            console.log('Modelos  sincronizados correctamente.');
        } catch (error) {
            console.error('Error al sincronizar los modelos :', error);
        }
    }

    getApp() {
        return this.app;
    }
}

export default DenunciasService;