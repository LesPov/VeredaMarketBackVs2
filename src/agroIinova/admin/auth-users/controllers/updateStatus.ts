import { Request, Response } from 'express';
import { AuthModel } from '../../../auth/middleware/models/authModel';

export const updateStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    // Se asume que el middleware validateToken agrega la propiedad user a req
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ msg: 'No autorizado' });
      return;
    }

    // Usa user.userId o user.id, según lo que esté definido
    const userId = user.userId || user.id;
    if (!userId) {
      res.status(400).json({ msg: 'No se pudo determinar el id del usuario' });
      return;
    }

    const { status } = req.body;
    // Validar que el status sea uno de los permitidos
    if (status !== 'Activado' && status !== 'Desactivado') {
      res.status(400).json({ msg: 'Valor de status inválido' });
      return;
    }

    const [affectedRows] = await AuthModel.update(
      { status: status as 'Activado' | 'Desactivado' },
      { where: { id: userId } }
    );

    if (affectedRows === 0) {
      res.status(404).json({ msg: 'Usuario no encontrado o no actualizado' });
      return;
    }

    res.json({ msg: 'Estado actualizado', status });
  } catch (error) {
    console.error('Error en updateStatus:', error);
    res.status(500).json({ msg: 'Error al actualizar el estado' });
  }
};
