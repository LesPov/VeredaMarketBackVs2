import dotenv from 'dotenv';
import express, { Application } from 'express';
import adminRouter from '../routes/adminRoute';
import adminAuthsUsersRouter from '../auth-users/routes/adminAuthsUsersRouter';
import adminProfileUsersRouter from '../profile-users/routes/profileUseRouter';

dotenv.config();

class AdminServer {
    private app: Application;

    constructor() {
        this.app = express();
        this.middlewares(); // Aplica primero los middlewares
        this.routes();      // Luego define las rutas
        this.dbConnect();
    }

    routes() {
        this.app.use('/user/admin', adminRouter, adminAuthsUsersRouter,adminProfileUsersRouter);
    }

    middlewares() {
        this.app.use(express.json());
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

export default AdminServer;