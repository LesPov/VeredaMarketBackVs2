import dotenv from 'dotenv';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import adminAuthsUsersRouter from '../../auth-users/routes/adminAuthsUsersRouter';
import adminProfileUsersRouter from '../../profile-users/routes/profileUseRouter';
import adminRouter from '../../routes/adminRoute';
import adminZoneRouter from '../../auth-users/routes/adminRegisteruserCA';

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
    this.app.use('/user/admin', adminRouter, adminAuthsUsersRouter, adminProfileUsersRouter, adminZoneRouter);
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
