import dotenv from 'dotenv';
import express, { Application } from 'express';
import campesinoRouter from '../../routes/campesinoRouter';
import registerCampesinoRouter from '../../routes/registerCampesinosRouter';
import FamilyCompositionModel from '../models/familyComposition.model';
import FamilyMemberModel from '../models/familyMember.model';
import FarmProfile from '../models/farmProfile.model';
import InfrastructureModel from '../models/infrastructure.model';
import MainProductModel from '../models/mainProduct.model';
import ProductiveInfoModel from '../models/productiveInfo.model';
import SocioDemographicModel from '../../../admin/profile-users/middleware/models/socioDemographic.model';
import TechnologyPracticeModel from '../models/technologyPractice.model';

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
        this.app.use('/user', campesinoRouter, registerCampesinoRouter);
    }

    middlewares() {
        this.app.use(express.json());
    }

     async dbConnect() {
        try {
      
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

export default CampiAmigosServer;