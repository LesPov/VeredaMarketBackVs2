

import { Sequelize } from "sequelize";


const sequelize = new Sequelize('denuncias', 'root', 'admin123', {
    host: 'localhost',
    dialect: 'mysql', // o el dialecto que uses (postgres, sqlite, etc.)

});

export default sequelize;

 