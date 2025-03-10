import dotenv from 'dotenv';
import express, { Application } from 'express';
import clientRouter from '../../routes/clientRouter';
import FamilyCompositionModel from '../models/familyComposition.model';
import FamilyMemberModel from '../models/familyMember.model';
import FarmProfile from '../models/farmProfile.model';
import InfrastructureModel from '../models/infrastructure.model';
import MainProductModel from '../models/mainProduct.model';
import { PersonalDataModel } from '../models/personalData.model';
import ProductiveInfoModel from '../models/productiveInfo.model';
import SocioDemographicModel from '../models/socioDemographic.model';
import TechnologyPracticeModel from '../models/technologyPractice.model';
import registerCampesinoRouter from '../../routes/registerCampesinosRouter';

dotenv.config();

class ClientServer {
    private app: Application;

    constructor() {
        this.app = express();
        this.middlewares(); // Aplica primero los middlewares
        this.routes();      // Luego define las rutas
        this.dbConnect();
    }

    routes() {
        this.app.use('/user', clientRouter,  registerCampesinoRouter);
    }

    middlewares() {
        this.app.use(express.json());
    }

    async dbConnect() {
        try {
            await PersonalDataModel.sync();
            await SocioDemographicModel.sync();
            await FamilyCompositionModel.sync();
            await FamilyMemberModel.sync();
            await FarmProfile.sync();
            await InfrastructureModel.sync();
            await ProductiveInfoModel.sync();
            await MainProductModel.sync();
            await TechnologyPracticeModel.sync();


            console.log('Modelos de denuncias sincronizados correctamente.');
        } catch (error) {
            console.error('Error al sincronizar los modelos de denuncias:', error);
        }
    }

    getApp() {
        return this.app;
    }
}

export default ClientServer;