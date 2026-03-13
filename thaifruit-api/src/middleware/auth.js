import { supabaseAdmin } from '../config/supabase.js';

// Verify JWT and attach user to req
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization token' });
  }

  const token = header.slice(7);
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // Fetch profile with role
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id, name, role')
    .eq('id', user.id)
    .single();

  req.user = { ...user, profile };
  req.token = token;
  next();
}

// Optional auth — attaches user if token present, continues without if not
export async function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next();

  const token = header.slice(7);
  const { data: { user } } = await supabaseAdmin.auth.getUser(token);

  if (user) {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id, name, role')
      .eq('id', user.id)
      .single();
    req.user = { ...user, profile };
    req.token = token;
  }
  next();
}

// Require specific role
export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user?.profile || req.user.profile.role !== role) {
      return res.status(403).json({ error: `Requires ${role} role` });
    }
    next();
  };
}
