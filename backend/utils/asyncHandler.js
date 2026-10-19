// Express 4 doesn't catch rejected promises, so wrap every async handler.
export default (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
