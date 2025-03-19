// src/controllers/sociodemografica/updateSociodemograficaController.ts
import { Request, Response } from 'express';
import { SocioDemographicModel } from '../../middleware/models/socioDemographic.model';

/**
 * Controlador PUT para actualizar (o crear si no existe) la información sociodemográfica de un usuario.
 * Se espera que el parámetro de la ruta contenga el ID del usuario.
 * Los datos a actualizar se reciben en el body de la petición.
 */
export const updateSociodemograficaController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extraemos el id del usuario desde los parámetros de la URL
    const { id } = req.params;

    // Aseguramos que el id es un número y, opcionalmente, podemos verificar su existencia en la tabla auth
    const userId = Number(id);
    if (isNaN(userId)) {
      res.status(400).json({ msg: 'El ID del usuario debe ser un número válido.' });
      return;
    }

    // Buscamos el registro sociodemográfico asociado al usuario
    let socioInfo = await SocioDemographicModel.findOne({ where: { userId: userId } });

    // Si no se encuentra el registro, creamos uno nuevo con los datos recibidos
    if (!socioInfo) {
      // IMPORTANTE: Verifica que el usuario exista en la tabla auth antes de crear
      socioInfo = await SocioDemographicModel.create({ 
        ...req.body, 
        userId: userId  // aseguramos que el userId es un número
      });
      // Retornamos el registro creado con un código 201 (Created)
      res.status(201).json(socioInfo);
      return;
    }

    // Si el registro existe, actualizamos con los datos enviados en el body
    await SocioDemographicModel.update(req.body, { where: { userId: userId } });

    // Obtenemos el registro actualizado
    const updatedSocioInfo = await SocioDemographicModel.findOne({ where: { userId: userId } });
    
    // Retornamos la información actualizada con estado 200
    res.status(200).json(updatedSocioInfo);
  } catch (error: any) {
    console.error("Error en updateSociodemograficaController:", error);
    res.status(500).json({
      msg: error.message || 'Error en el servidor al actualizar la información sociodemográfica',
      error
    });
  }
};
