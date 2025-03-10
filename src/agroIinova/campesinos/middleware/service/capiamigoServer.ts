import dotenv from 'dotenv';
import express, { Application } from 'express';
import campesinoRouter from '../../routes/campesinoRouter';

dotenv.config();

class CampiAmigosServer {
    private app: Application;

    constructor() {
        this.app = express();
        this.middlewares(); // Aplica primero los middlewares
        this.routes();      // Luego define las rutas
        this.dbConnect();
    }

    routes() {
        this.app.use('/user', campesinoRouter);
    }

    middlewares() {
        this.app.use(express.json());
    }

    async dbConnect() {
        try {
      


            console.log('Modelos de denuncias sincronizados correctamente.');
        } catch (error) {
            console.error('Error al sincronizar los modelos de denuncias:', error);
        }
    }

    getApp() {
        return this.app;
    }
}

export default CampiAmigosServer;