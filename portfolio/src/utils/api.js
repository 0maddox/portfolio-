const rawApiBase = (import.meta.env.VITE_API_BASE_URL || "").trim();

export const API_BASE_URL = rawApiBase.replace(/\/+$/, "");

export function apiUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath;
}

export function resolveAssetUrl(path) {
  if (!path) return "";
  if (/^(https?:|data:|blob:)/i.test(path)) return path;

  // Uploaded profile images are served from backend /uploads.
  if (path.startsWith("/uploads/")) {
    return apiUrl(path);
  }

  return path;
}
