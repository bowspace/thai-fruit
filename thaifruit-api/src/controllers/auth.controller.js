import * as authService from '../services/auth.service.js';

export async function signup(req, res, next) {
  try {
    const result = await authService.signup(req.validated);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const result = await authService.login(req.validated);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    const profile = await authService.getProfile(req.user.id, req.user.email);
    res.json(profile);
  } catch (err) {
    next(err);
  }
}
