/**
 * @file server.ts
 * @description Clase que representa el servidor de la aplicación.
 */

import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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
import path from 'path';
import updateStatusRouter from '../agroIinova/admin/auth-users/routes/updateStatusRouter';
import AdminServer from '../agroIinova/admin/middleware/services/adminServices';
import UserService from '../agroIinova/user/middleware/services/user.service';


// Configurar las variables de entorno del archivo .env
dotenv.config();
class Server {

    private app: Application;
    private port: string;
    private prfileServer: ProfileServer;
    private adminServer: AdminServer;
    private userService: UserService;

    /**
     * Constructor de la clase Server.
     */
    constructor() { 
        this.app = express();
        this.port = process.env.PORT || '2020';
        this.prfileServer = new ProfileServer();
        this.adminServer = new AdminServer();
        this.userService = new UserService();

        this.app.use(this.prfileServer.getApp());
        this.app.use(this.adminServer.getApp());
        this.app.use(this.userService.getApp());

        this.listen();
        this.middlewares();
        this.routes();
        this.dbConnect();
    }


    /** 
     * Inicia el servidor y escucha en el puerto especificado.
     */
    listen() {
        this.app.listen(this.port, () => {
            console.log('Aplicacion corriendo en el puerto ' + this.port);
        })
    } 


    /**
     * Configura las rutas de la aplicación.
     */ 
    routes() {
        // Ruta para registrar nuevos usuarios
        this.app.use('/auth/user', registerRouter, emailVerificationRoutes, phoneVerificationRouter, loginUserRouter, adminRouter, countryPais);
        this.app.use('/auth/user/updateStatus', updateStatusRouter);

    }


    /**  
     * Configura los middlewares de la aplicación.
     */
    middlewares() {
        // Parseo body   
        this.app.use(express.json());

        this.app.use('/uploads', express.static(path.join(__dirname, '..', '..', 'uploads'), {
            setHeaders: (res, path) => {
                console.log(`Accediendo a: ${path}`);  // Aquí se agrega el console.log
            } 
        }));
        // Cors
        this.app.use(cors());
    }

    /**
     * Conecta a la base de datos y sincroniza los modelos de Product y User.
     */
    async dbConnect() {
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
