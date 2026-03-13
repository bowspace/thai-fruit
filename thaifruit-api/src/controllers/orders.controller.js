import * as ordersService from '../services/orders.service.js';

export async function create(req, res, next) {
  try {
    const orders = await ordersService.createOrder(req.user.id, req.validated);
    res.status(201).json(orders);
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    const role = req.user.profile?.role || 'buyer';
    const orders = await ordersService.listOrders(req.user.id, role);
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const order = await ordersService.getOrderById(req.params.id, req.user.id);
    res.json(order);
  } catch (err) {
    next(err);
  }
}

export async function updateStatus(req, res, next) {
  try {
    const order = await ordersService.updateOrderStatus(
      req.params.id,
      req.user.id,
      req.validated.status,
    );
    res.json(order);
  } catch (err) {
    next(err);
  }
}
