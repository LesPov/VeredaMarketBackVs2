import dotenv from 'dotenv';
import express, { Application } from 'express';

import cors from 'cors';
import userRouter from '../routes/userRouter';


dotenv.config();
 
class UserService {
    private app: Application;

    constructor() {
        this.app = express();

        this.middlewares(); // Aplica primero los middlewares
        this.routes();      // Luego define las rutas
        this.dbConnect();
    }

    routes() {
        this.app.use('/user', userRouter );
    }

    middlewares() {
        this.app.use(express.json());
        this.app.use(cors({
        }));
        this.app.options('*', cors());
    }

    async dbConnect() {
        try {

            console.log('Modelos  sincronizados correctamente.');
        } catch (error) {
            console.error('Error al sincronizar los modelos :', error);
        }
    }

    getApp() {
        return this.app;
    }
}

export default UserService;