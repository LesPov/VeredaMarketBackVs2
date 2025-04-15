import dotenv from 'dotenv';
import express, { Application } from 'express';

import cors from 'cors';
import campiAmigoRouter from '../../routes/campiamigoRouter';
import { ZoneModel } from '../models/zoneModel';
import { IndicatorModel } from '../models/indicador';
import { ProductModel } from '../models/productModel';
import productosRouter from '../../../admin/auth-users/controllers/RegisterCAmigos/utils/producto/routes/productosRouter';


dotenv.config();

class CampiAmigoService {
    private app: Application;

    constructor() {
        this.app = express();
        this.middlewares(); // Aplica primero los middlewares
        this.routes();      // Luego define las rutas
        this.dbConnect();
    }

    routes() {
        this.app.use('/campiamigo', campiAmigoRouter, productosRouter);
    }

    middlewares() {
        this.app.use(express.json());
        this.app.use(cors({
        }));
        this.app.options('*', cors());
    }

    async dbConnect() {
        try {
            await ZoneModel.sync();
            await IndicatorModel.sync();
            await ProductModel.sync();

            console.log('Modelos  sincronizados correctamente.');
        } catch (error) {
            console.error('Error al sincronizar los modelos :', error);
        }
    }

    getApp() {
        return this.app;
    }
}

export default CampiAmigoService;