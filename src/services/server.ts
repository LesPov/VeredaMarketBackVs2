/**
 * @file server.ts
 * @description Clase que representa el servidor de la aplicación.
 */

import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AuthModel } from '../agroIinova/auth/middleware/models/authModel';
import { userProfileModel } from '../agroIinova/auth/middleware/models/userProfileModel';
import { VerificationModel } from '../agroIinova/auth/middleware/models/verificationModel';
import registerRouter from '../agroIinova/auth/register/routes/registerRouter';
import emailVerificationRoutes from '../agroIinova/auth/email/routes/emailRoutes';
import phoneVerificationRouter from '../agroIinova/auth/phone/routers/phoneRoutes';
import loginUserRouter from '../agroIinova/auth/login/routes/loginRouter';
import adminRouter from '../agroIinova/admin/routes/adminRoute';
import clienteRouter from '../agroIinova/clientes/routes/clientRouter';
import campesinoRouter from '../agroIinova/campesinos/routes/registerCampesinosRouter';
import { Country } from '../agroIinova/auth/middleware/models/paisModel';
import countryPais from '../agroIinova/auth/pais/routes/paisRouter';
import CampiAmigosServer from '../agroIinova/campesinos/middleware/service/capiamigoServer';


// Configurar las variables de entorno del archivo .env
dotenv.config();
class Server {

    private app: Application;
    private port: string;
    private campiAmigosServer: CampiAmigosServer;


    /**
     * Constructor de la clase Server.
     */
    constructor() {
        this.app = express();
        this.port = process.env.PORT || '2025';
        this.campiAmigosServer = new CampiAmigosServer();
        this.app.use(this.campiAmigosServer.getApp());

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
        this.app.use('/admin/user', adminRouter);
        this.app.use('/client/user', clienteRouter);
    }


    /**  
     * Configura los middlewares de la aplicación.
     */
    middlewares() {
        // Parseo body   
        this.app.use(express.json());

        // Cors
        this.app.use(cors());
    }

    /**
     * Conecta a la base de datos y sincroniza los modelos de Product y User.
     */
    async dbConnect() {
        try {
            await AuthModel.sync();
            await userProfileModel.sync();
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
