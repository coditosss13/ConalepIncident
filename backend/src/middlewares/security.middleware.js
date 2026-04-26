const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { AppError } = require('./error.middleware');

const securityHeaders = helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false
});

const authLimiter = rateLimit({
  windowMs: Number(process.env.AUTH_RATE_WINDOW_MS || 15 * 60 * 1000),
  max: Number(process.env.AUTH_RATE_MAX_REQUESTS || 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiados intentos de autenticacion. Intenta nuevamente mas tarde.'
  }
});

const refreshLimiter = rateLimit({
  windowMs: Number(process.env.REFRESH_RATE_WINDOW_MS || 15 * 60 * 1000),
  max: Number(process.env.REFRESH_RATE_MAX_REQUESTS || 20),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiadas renovaciones de sesion. Intenta nuevamente mas tarde.'
  }
});

const loginAttempts = new Map();
const LOGIN_FAIL_THRESHOLD = Number(process.env.LOGIN_FAIL_THRESHOLD || 5);
const LOGIN_LOCK_BASE_MS = Number(process.env.LOGIN_LOCK_BASE_MS || 60 * 1000);
const LOGIN_LOCK_MAX_MS = Number(process.env.LOGIN_LOCK_MAX_MS || 30 * 60 * 1000);

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function getAttemptKey(req) {
  const email = normalizeEmail(req.body?.email);
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  return `${email}|${ip}`;
}

function checkLoginLock(req, res, next) {
  const key = getAttemptKey(req);
  const state = loginAttempts.get(key);

  if (state?.lockUntil && state.lockUntil > Date.now()) {
    const secondsLeft = Math.ceil((state.lockUntil - Date.now()) / 1000);
    return next(new AppError(`Cuenta temporalmente bloqueada. Intenta en ${secondsLeft} segundo(s).`, 429));
  }

  if (state?.lockUntil && state.lockUntil <= Date.now()) {
    loginAttempts.delete(key);
  }

  return next();
}

function registerLoginFailure(req) {
  const key = getAttemptKey(req);
  const previous = loginAttempts.get(key) || { fails: 0, lockUntil: null };
  const fails = previous.fails + 1;
  const lockLevel = Math.max(0, fails - LOGIN_FAIL_THRESHOLD);
  const lockMs = lockLevel > 0
    ? Math.min(LOGIN_LOCK_BASE_MS * (2 ** (lockLevel - 1)), LOGIN_LOCK_MAX_MS)
    : 0;

  loginAttempts.set(key, {
    fails,
    lockUntil: lockMs ? Date.now() + lockMs : null
  });
}

function registerLoginSuccess(req) {
  const key = getAttemptKey(req);
  loginAttempts.delete(key);
}

module.exports = {
  securityHeaders,
  authLimiter,
  refreshLimiter,
  checkLoginLock,
  registerLoginFailure,
  registerLoginSuccess
};
