const pad = (n) => String(n).padStart(2, '0');

// Local calendar day as YYYY-MM-DD (also the format <input type="date"> uses)
export const dateKey = (d) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`;
};

// Noon local time avoids the date drifting a day when converted to UTC
export const fromInputDate = (v) => new Date(`${v}T12:00:00`).toISOString();
export const endOfInputDate = (v) => new Date(`${v}T23:59:59`).toISOString();

export const startOfDay = (d = new Date()) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

export const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

export const fmtDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

export const errMsg = (e) => e.response?.data?.message || e.message || 'Something went wrong';
