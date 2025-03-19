import dotenv from 'dotenv';
import express, { Application } from 'express';
import campesinoRouter from '../../routes/campesinoRouter';
import registerCampesinoRouter from '../../routes/registerCampesinosRouter';
import FamilyMemberModel from '../../../admin/profile-users/middleware/models/familyMember.model';
import FarmProfile from '../../../admin/profile-users/middleware/models/farmProfile.model';
import InfrastructureModel from '../../../admin/profile-users/middleware/models/infrastructure.model';
import MainProductModel from '../../../admin/profile-users/middleware/models/mainProduct.model';
import ProductiveInfoModel from '../../../admin/profile-users/middleware/models/productiveInfo.model';
import TechnologyPracticeModel from '../../../admin/profile-users/middleware/models/technologyPractice.model';
import { SocioDemographicModel } from '../../../admin/profile-users/middleware/models/socioDemographic.model';
import { FamilyCompositionModel } from '../../../admin/profile-users/middleware/models/familyComposition.model';

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



            console.log('Modelos sincronizados correctamente.');
        } catch (error) {
            console.error('Error al sincronizar los modelos:', error);
        }
    }

    getApp() {
        return this.app;
    }
}

export default CampiAmigosServer;