// src/agroIinova/admin/auth-users/controllers/RegisterCAmigos/utils/producto/utils/hook.ts

import { fn, col } from 'sequelize';
 import { ProductModel } from '../../../../../../../campiamigo/middleware/models/productModel';
import { ReviewModel } from '../../../../../../../campiamigo/middleware/models/reviewModel';

interface StatsResult {
  avgRating: string;      // Sequelize devuelve strings para AVG y COUNT en raw
  totalReviews: string;
}

// HOOK: tras crear una review, recalcula el rating y reviewCount
ReviewModel.afterCreate(async (review, options) => {
  const productId = review.productId;

  // obtenemos AVG y COUNT con alias
  const stats = await ReviewModel.findOne({
    where: { productId },
    attributes: [
      [fn('AVG', col('rating')), 'avgRating'],
      [fn('COUNT', col('id')), 'totalReviews'],
    ],
    raw: true,
  }) as StatsResult | null;

  // parseamos a números
  const avgRating = stats && stats.avgRating
    ? parseFloat(stats.avgRating)
    : 0;
  const totalReviews = stats && stats.totalReviews
    ? parseInt(stats.totalReviews, 10)
    : 0;

  // actualizamos el producto
  await ProductModel.update(
    { rating: avgRating, reviewCount: totalReviews },
    { where: { id: productId } }
  );
});
