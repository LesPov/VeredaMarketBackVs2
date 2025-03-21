import { Request, Response } from 'express';
import { SubtipoDenunciaModel } from '../../middleware/models/subtipoDenunciaModel';
import path from 'path';

/**
 * Controlador para obtener todos los subtipos de denuncias.
 * Se consulta el modelo SubtipoDenunciaModel y se construye la URL completa para la imagen.
 * 
 * @param req - Objeto de solicitud.
 * @param res - Objeto de respuesta.
 */
export const getSubtiposDenuncia = async (req: Request, res: Response) => {
  try {
    // Obtener todos los subtipos
    const subtipos = await SubtipoDenunciaModel.findAll();

    // Construir el objeto de respuesta con la URL completa de la imagen.
    // Ajusta la URL base según tu entorno o usa una variable de entorno.
    const subtiposConImagen = subtipos.map(subtipo => {
      return {
        ...subtipo.toJSON(),
        imageUrl: `https://g7hr118t-1001.use2.devtunnels.ms/uploads/subtipoDenuncias/${subtipo.flagImage}`
      };
    });

    res.json(subtiposConImagen);
  } catch (error) {
    console.error('Error al obtener subtipos de denuncia:', error);
    res.status(500).json({ message: 'Error al obtener los subtipos de denuncia' });
  }
};
