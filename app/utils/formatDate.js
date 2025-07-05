// utils/formatPostDate.js
export function formatPostDate(dateString) {
  const date = new Date(dateString);
  const now  = new Date();
  const diffMs  = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffH   = Math.floor(diffMin / 60);
  const diffD   = Math.floor(diffH / 24);

  if (diffD >= 1 && diffD <= 6) {
    return `${diffD} day${diffD > 1 ? "s" : ""} ago`;
  }
  if (diffH >= 1 && diffD < 1) {
    return `${diffH} hour${diffH > 1 ? "s" : ""} ago`;
  }
  if (diffMin >= 1 && diffH < 1) {
    return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
  }
  if (diffSec >= 1 && diffMin < 1) {
    return `${diffSec} second${diffSec > 1 ? "s" : ""} ago`;
  }

  // More than 6 days or fallback: YYYY/MM/DD
  const yyyy = date.getFullYear();
  const mm   = String(date.getMonth() + 1).padStart(2, "0");
  const dd   = String(date.getDate()).padStart(2, "0");
  return `${yyyy}/${mm}/${dd}`;
}
