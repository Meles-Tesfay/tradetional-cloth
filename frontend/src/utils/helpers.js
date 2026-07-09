export const getImageUrl = (imagePath, cacheBust = '') => {
  if (!imagePath) return "";
  
  const appendCacheBust = (url) => {
    if (!cacheBust) return url;
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}v=${cacheBust}`;
  };

  if (imagePath.startsWith("http") || imagePath.startsWith("data:")) {
    return appendCacheBust(imagePath);
  }
  if (imagePath.startsWith("/uploads/")) {
    const API_BASE = import.meta.env.VITE_API_URL || "";
    const base = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
    return appendCacheBust(`${base}${imagePath}`);
  }
  return appendCacheBust(imagePath);
};
