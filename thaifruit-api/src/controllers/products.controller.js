import * as productsService from '../services/products.service.js';
import * as storesService from '../services/stores.service.js';

export async function list(req, res, next) {
  try {
    const result = await productsService.listProducts(req.validatedQuery);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const product = await productsService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Also fetch related products
    const related = await productsService.getRelatedProducts(
      product.id,
      product.category,
      product.storeId,
    );

    res.json({ ...product, related });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const store = await storesService.getStoreByOwner(req.user.id);
    if (!store) return res.status(403).json({ error: 'You do not have a store' });

    const product = await productsService.createProduct(store.id, req.validated);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const store = await storesService.getStoreByOwner(req.user.id);
    if (!store) return res.status(403).json({ error: 'You do not have a store' });

    const product = await productsService.updateProduct(req.params.id, store.id, req.validated);
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const store = await storesService.getStoreByOwner(req.user.id);
    if (!store) return res.status(403).json({ error: 'You do not have a store' });

    await productsService.deleteProduct(req.params.id, store.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
