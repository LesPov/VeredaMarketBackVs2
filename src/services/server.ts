/**
 * @file server.ts
 * @description Clase que representa el servidor de la aplicación.
 */
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { AuthModel } from '../agroIinova/auth/middleware/models/authModel';
import { VerificationModel } from '../agroIinova/auth/middleware/models/verificationModel';
import registerRouter from '../agroIinova/auth/register/routes/registerRouter';
import emailVerificationRoutes from '../agroIinova/auth/email/routes/emailRoutes';
import phoneVerificationRouter from '../agroIinova/auth/phone/routers/phoneRoutes';
import loginUserRouter from '../agroIinova/auth/login/routes/loginRouter';
import adminRouter from '../agroIinova/admin/routes/adminRoute';
import { Country } from '../agroIinova/auth/middleware/models/paisModel';
import countryPais from '../agroIinova/auth/pais/routes/paisRouter';
import ProfileServer from '../agroIinova/auth/profile/middleware/services/profileServer';
import updateStatusRouter from '../agroIinova/admin/auth-users/routes/updateStatusRouter';
import AdminServer from '../agroIinova/admin/middleware/services/adminServices';
import UserService from '../agroIinova/user/middleware/services/user.service';
import CampiAmigoService from '../agroIinova/campiamigo/middleware/services/campiamigo.service';

dotenv.config();

class Server {
  private app: Application;
  private port: string;
  private prfileServer: ProfileServer;
  private adminServer: AdminServer;
  private userService: UserService;
  private campiAmigoService: CampiAmigoService;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || '2025';
    // Aplica CORS globalmente: 
    // Permite todos los orígenes o, si prefieres, especifica 'http://localhost:4200'
    this.app.use(cors({ origin: '*' }));
    this.app.options('*', cors());

    this.prfileServer = new ProfileServer();
    this.adminServer = new AdminServer();
    this.userService = new UserService();
    this.campiAmigoService = new CampiAmigoService();

    // Middleware global para CORS con tipos explícitos (se aplica antes de cualquier otra cosa)

    // Middlewares de parseo y archivos estáticos
    this.middlewares();
    // Definición de rutas
    this.routes();
    // Conexión a la base de datos
    this.dbConnect();
    // Inicio del servidor
    this.listen();
  }

  /** Inicia el servidor y escucha en el puerto especificado */
  listen(): void {
    this.app.listen(this.port, () => {
      console.log('Aplicación corriendo en el puerto ' + this.port);
    });
  }

  /**
   * Configura las rutas de la aplicación.
   */
  routes(): void {
    // Rutas de autenticación y registro
    this.app.use(
      '/auth/user',
      registerRouter,
      emailVerificationRoutes,
      phoneVerificationRouter,
      loginUserRouter,
      adminRouter,
      countryPais
    );
    this.app.use('/auth/user/updateStatus', updateStatusRouter);

    // Rutas de otros módulos
    this.app.use(this.prfileServer.getApp());
    this.app.use(this.adminServer.getApp());
    this.app.use(this.userService.getApp());
    this.app.use(this.campiAmigoService.getApp());

    // Ruta de prueba para verificar CORS (opcional)
    this.app.get('/test-cors', (req: Request, res: Response): void => {
      res.json({ msg: "CORS funciona correctamente" });
    });
  }

  /** Configura los middlewares adicionales */
  middlewares(): void {
    // Parsear JSON y URL encoded (límite de 100mb)
    this.app.use(express.json({ limit: '100mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '100mb' }));

    // Servir archivos estáticos (por ejemplo, la carpeta "uploads")
    this.app.use(
        '/uploads',
        express.static(path.join(__dirname, '..', '..', 'uploads'), {
          setHeaders: (res: Response, filePath: string): void => {
            // Permitir acceso desde cualquier origen
            res.set('Access-Control-Allow-Origin', '*');
            console.log(`Accediendo a: ${filePath}`);
          },
        })
      );
      

    // Se agrega el middleware de CORS (opcional, ya lo aplicamos globalmente)
    this.app.use(cors());
    this.app.options('*', cors());
  }

  /**
   * Conecta a la base de datos y sincroniza los modelos.
   */
  async dbConnect(): Promise<void> {
    try {
      await AuthModel.sync();
      await VerificationModel.sync();
      await Country.sync();
      console.log('Conexión a la base de datos establecida correctamente.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }
}

export default Server;

console.log(new Date());
