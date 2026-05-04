/* ─── color tokens ─────────────────────────────────────────────────────────── */
export const BLUE  = "#1a56db";
export const NAVY  = "#0b1a2e";
export const WHITE = "#ffffff";

/* ─── calendar constants ────────────────────────────────────────────────────── */
export const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
export const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
export const TIME_SLOTS = [
  "9:00 AM","10:00 AM","11:00 AM","12:00 PM",
  "1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM",
];

/* ─── helpers ───────────────────────────────────────────────────────────────── */
export const formatPrice = (price) =>
  "₦" + new Intl.NumberFormat("en-NG").format(price);

export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year, month) {
  // Monday-indexed (0=Mon … 6=Sun)
  const day = new Date(year, month, 1).getDay();
  return (day + 6) % 7;
}

export function formatDateLabel(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}