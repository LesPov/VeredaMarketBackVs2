import { getAllCountryCodes } from "../controller/paisController";
import express from 'express';
const countryPais = express.Router();

// Ruta para obtener todos los códigos de país
countryPais.get('/countries', getAllCountryCodes);

export default countryPais;
