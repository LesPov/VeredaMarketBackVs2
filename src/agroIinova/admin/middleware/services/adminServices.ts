import dotenv from 'dotenv';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import adminProfileUsersRouter from '../../profile-users/routes/profileUseRouter';
import adminRouter from '../../routes/adminRoute';
import adminZoneRouter from '../../auth-users/routes/adminRegisteruser';
import adminAuthsUsersRouter from '../../auth-users/controllers/RegisterCAmigos/utils/zone/routes/adminAuthsUsersRouter';
import productosRouter from '../../auth-users/controllers/RegisterCAmigos/utils/producto/routes/productosRouter';
import tagRouter from '../../auth-users/controllers/RegisterCAmigos/utils/etiqueta/routes/tagRouter';

dotenv.config();

class AdminServer {
  private app: Application;

  constructor() {
    this.app = express();
    // Middleware global para CORS con tipos explícitos


    this.middlewares(); // Otros middlewares
    this.routes();      // Definición de rutas
    this.dbConnect();
  }

  routes(): void {
    this.app.use('/user/admin', adminRouter, adminAuthsUsersRouter, adminProfileUsersRouter, adminZoneRouter, productosRouter,tagRouter);
  }

  middlewares(): void {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.options('*', cors());
  }

  async dbConnect(): Promise<void> {
    try {
      console.log('Modelos sincronizados correctamente.');
    } catch (error) {
      console.error('Error al sincronizar los modelos:', error);
    }
  }

  getApp(): Application {
    return this.app;
  }
}

export default AdminServer;
