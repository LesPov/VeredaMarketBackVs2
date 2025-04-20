// src/agroIinova/admin/auth-users/controllers/RegisterCAmigos/utils/producto/postProductController.ts

import { Request, Response } from 'express';
import uploadAssets from './uploadAssetsConfig';
import { ProductModel } from '../../../../../../campiamigo/middleware/models/productModel';

export const createProductController = async (req: Request, res: Response): Promise<void> => {
  uploadAssets(req, res, async err => {
    if (err) {
      return res.status(400).json({ msg: `Error en la subida de activos: ${err.message}` });
    }
    try {
      const files = req.files as Record<string, Express.Multer.File[]>;
      const imagenes = files.imagenes?.map(f => f.filename) || [];
      const videos   = files.videos?.map(f => f.filename)   || [];
      const modelos  = files.modelos?.map(f => f.filename)  || [];

      const { name, subtitle, description, price, stock } = req.body;
      if (!name || price == null) {
        return res.status(400).json({ msg: 'Los campos "name" y "price" son obligatorios.' });
      }
      if (subtitle && subtitle.length > 255) {
        return res.status(400).json({ msg: 'El "subtitle" no puede superar 255 caracteres.' });
      }

      const userId = Number(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ msg: 'El parámetro "id" debe ser numérico.' });
      }

      const newProduct = await ProductModel.create({
        name,
        subtitle: subtitle || null,
        description: description || null,
        price: parseFloat(price),    // se almacena como string "1000.00" en DB
        image:   imagenes[0] || null,
        video:   videos[0]   || null,
        glbFile: modelos[0]  || null,
        userId,
        stock:   stock != null ? parseInt(stock, 10) : 0,
        rating:  0
      });

      // Al devolver newProduct, su price ya sale como number (1000)
      res.status(201).json({
        msg: 'Producto creado correctamente.',
        product: newProduct
      });
    } catch (error: any) {
      console.error("Error en createProductController:", error);
      res.status(500).json({ msg: 'Error al crear el producto.', error: error.message });
    }
  });
};
