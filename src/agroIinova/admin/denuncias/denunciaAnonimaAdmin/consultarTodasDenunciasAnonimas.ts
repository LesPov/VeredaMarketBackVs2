import { Request, Response } from 'express';
import { errorMessages } from '../../../auth/middleware/errors/errorMessages';
import { successMessages } from '../../../auth/middleware/success/successMessages';
import { DenunciaAnonimaModel } from '../../../user/denuncias/middleware/models/denunciasAnonimasModel';
import { SubtipoDenunciaModel } from '../../../user/denuncias/middleware/models/subtipoDenunciaModel';
import { TipoDenunciaModel } from '../../../user/denuncias/middleware/models/tipoDenunciaModel';

export const consultarTodasDenunciasAnonimas = async (req: Request, res: Response): Promise<void> => {
    try {
        // Búsqueda de todas las denuncias con sus asociaciones
        const denuncias = await DenunciaAnonimaModel.findAll({
            include: [
                {
                    model: TipoDenunciaModel,
                    as: 'TipoDenuncia',
                    attributes: ['id', 'nombre'],
                    required: true,
                },
                {
                    model: SubtipoDenunciaModel,
                    as: 'SubtipoDenuncia',
                    attributes: ['id', 'nombre'],
                    required: true,
                }
            ],
            attributes: [
                'id',
                'descripcion',
                'direccion',
                'status',
                'claveUnica',
                'pruebas',
                'audio',
                'tieneEvidencia',
                'createdAt',
                'updatedAt',
                'tipoDenunciaId',
                'subtipoDenunciaId',
            ]
        });

        // Si no hay registros, se retorna error 404
        if (!denuncias || denuncias.length === 0) {
            res.status(404).json({
                success: false,
                message: errorMessages.denunciaNotFound,
                error: 'No se encontraron denuncias anónimas'
            });
            return;
        }

        // Se formatea cada denuncia para estructurar la respuesta
        const denunciasFormateadas = denuncias.map(denuncia => {
            const pruebasUrls = denuncia.pruebas
                ? denuncia.pruebas.split(',').map((file: string) => {
                    const trimmedFile = file.trim();
                    // Se determina el tipo de evidencia (video o imagen)
                    if (trimmedFile.endsWith('.webm') || trimmedFile.endsWith('.mp4')) {
                        return {
                            type: 'video',
                            url: `https://g7hr118t-1001.use2.devtunnels.ms/uploads/evidenciasDenuncias/videos/${trimmedFile}`
                        };
                    } else {
                        return {
                            type: 'image',
                            url: `https://g7hr118t-1001.use2.devtunnels.ms/uploads/evidenciasDenuncias/imagenes/${trimmedFile}`
                        };
                    }
                })
                : [];

            const audioUrl = denuncia.audio
                ? `https://g7hr118t-1001.use2.devtunnels.ms/uploads/evidenciasDenuncias/audios/${denuncia.audio}`
                : null;

            return {
                id: denuncia.id,
                descripcion: denuncia.descripcion,
                direccion: denuncia.direccion,
                status: denuncia.status,
                claveUnica: denuncia.claveUnica,
                tipoDenuncia: denuncia.TipoDenuncia ? {
                    id: denuncia.TipoDenuncia.id,
                    nombre: denuncia.TipoDenuncia.nombre,
                } : null,
                subtipoDenuncia: denuncia.SubtipoDenuncia ? {
                    id: denuncia.SubtipoDenuncia.id,
                    nombre: denuncia.SubtipoDenuncia.nombre,
                } : null,
                pruebas: pruebasUrls,
                audio: audioUrl,
                tieneEvidencia: denuncia.tieneEvidencia,
                fechaCreacion: denuncia.createdAt,
                fechaActualizacion: denuncia.updatedAt,
            };
        });

        // Se envía la respuesta exitosa
        res.status(200).json({
            success: true,
            message: successMessages.consultaExitosa,
            denuncias: denunciasFormateadas,
        });
        return;
    } catch (error: any) {
        console.error("Error en el controlador de consulta de todas las denuncias anónimas:", error);
        res.status(500).json({
            success: false,
            message: errorMessages.serverError,
            error: error.message,
        });
        return;
    }
};
