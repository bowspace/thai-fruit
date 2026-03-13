import * as storesService from '../services/stores.service.js';

export async function list(req, res, next) {
  try {
    const stores = await storesService.listStores();
    res.json(stores);
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const store = await storesService.getStoreById(req.params.id);
    if (!store) return res.status(404).json({ error: 'Store not found' });
    res.json(store);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const existing = await storesService.getStoreByOwner(req.user.id);
    if (existing) return res.status(409).json({ error: 'You already have a store' });

    const store = await storesService.createStore(req.user.id, req.validated);
    res.status(201).json(store);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const store = await storesService.updateStore(req.params.id, req.user.id, req.validated);
    res.json(store);
  } catch (err) {
    next(err);
  }
}
