export function isValidDocUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  if (typeof url !== 'string') return false;
  
  const trimmed = url.trim();
  if (trimmed === '') return false;
  if (trimmed.toLowerCase() === 'null') return false;
  if (trimmed.toLowerCase() === 'undefined') return false;
  
  return true;
}
