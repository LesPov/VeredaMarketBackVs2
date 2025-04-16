import { Request, Response } from 'express';
import uploadAssets from './uploadAssetsConfig';
import { ProductModel } from '../../../../../../campiamigo/middleware/models/productModel';

export const createProductController = async (req: Request, res: Response): Promise<void> => {
  // Procesa la subida de archivos
  uploadAssets(req, res, async (err: any) => {
    if (err) {
      console.error("Error en la subida de activos:", err.message);
      res.status(400).json({
        msg: `Error en la subida de activos: ${err.message}`,
        errors: 'Error al cargar los archivos'
      });
      return;
    }

    try {
      // Extraer los archivos enviados; se esperan tres grupos: 'imagenes', 'videos' y 'modelos'
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const imagenes = files?.imagenes ? files.imagenes.map(file => file.filename) : [];
      const videos = files?.videos ? files.videos.map(file => file.filename) : [];
      const modelos = files?.modelos ? files.modelos.map(file => file.filename) : [];

      // Extraer los datos del producto del body
      const { name, description, price } = req.body;
      if (!name || !price) {
        res.status(400).json({
          msg: 'Los campos "name" y "price" son obligatorios.'
        });
        return;
      }

      // Recuperamos el userId desde los parámetros de la ruta
      const userId = parseInt(req.params.id);
      if (!userId) {
        res.status(400).json({
          msg: 'El parámetro "id" del usuario es obligatorio y debe ser numérico.'
        });
        return;
      }

      // Seleccionar el primer archivo subido para cada tipo (si existen)
      const image = imagenes.length > 0 ? imagenes[0] : null;
      const video = videos.length > 0 ? videos[0] : null;
      const glbFile = modelos.length > 0 ? modelos[0] : null;

      // Crear el producto en la base de datos
      const newProduct = await ProductModel.create({
        name,
        description,
        price,
        image,     // Guarda la primera imagen del arreglo
        video,     // Guarda el primer video del arreglo
        glbFile,   // Guarda el primer archivo 3D del arreglo
        userId
      });

      res.status(201).json({
        msg: 'Producto creado correctamente.',
        product: newProduct,
      });
    } catch (error: any) {
      console.error("Error en createProductController:", error);

      // Lógica para personalizar el mensaje del error
      let errorMsg = 'Error al crear el producto.';
      
      // Si es un error de precio fuera de rango:
      if (error.parent && error.parent.sqlMessage && error.parent.sqlMessage.includes("Out of range value for column 'price'")) {
        errorMsg = 'El valor ingresado para el precio es demasiado alto. Verifica que no exceda el límite permitido.';
      }
      // Si es un error de restricción única (producto duplicado para el mismo usuario):
      else if (error.name === 'SequelizeUniqueConstraintError') {
        errorMsg = 'El producto ya existe para este usuario. Por favor, utiliza otro nombre.';
      }

      res.status(500).json({
        msg: errorMsg,
        error: error.message
      });
    }
  });
};
