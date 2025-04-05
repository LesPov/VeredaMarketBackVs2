import { Request, Response } from 'express';
import { IndicatorModel } from '../../../../../../campiamigo/middleware/models/indicador';

export const updateIndicatorColor = async (req: Request, res: Response): Promise<void> => {
  try {
    // Se extrae el id del perfil de usuario desde los parámetros de la ruta
    const { id } = req.params;
    // Se extrae el nuevo color y opcionalmente el id del usuario que actualiza
    const { color, updatedBy } = req.body;

    // Validar que se envíe un color
    if (!color) {
      res.status(400).json({ msg: 'Debe proporcionar un color para actualizar el indicador.' });
      return;
    }

    // Buscar el indicador asociado a este usuario (ya que se garantiza que es único)
    const indicator = await IndicatorModel.findOne({ where: { userId: id } });
    if (!indicator) {
      res.status(404).json({ msg: 'Indicador no encontrado para el usuario especificado.' });
      return;
    }

    // Actualizar el color (y el campo updatedBy si se envía)
    await indicator.update({ color, updatedBy });

    res.status(200).json({
      msg: 'Indicador actualizado exitosamente.',
      indicator,
    });
  } catch (error: any) {
    console.error('Error al actualizar el indicador:', error);
    res.status(500).json({
      msg: 'Error al actualizar el indicador.',
      error: error.message,
    });
  }
};
