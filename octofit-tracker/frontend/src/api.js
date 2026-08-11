// VITE_CODESPACE_NAME must be defined in .env.local for Codespaces deployment

/**
 * Builds the full API URL. Falls back to localhost when VITE_CODESPACE_NAME is unset.
 * Usage: getApiUrl('/api/activities/')
 */
export const getApiUrl = (path) => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
  const base =
    codespaceName && codespaceName !== 'undefined'
      ? `https://${codespaceName}-8000.app.github.dev`
      : 'http://localhost:8000';
  return `${base}${path}`;
};

export const fetchApiData = async (path) => {
  try {
    const url = getApiUrl(path);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Handle both paginated and array responses
    if (data.results) {
      return data.results;
    }
    
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Failed to fetch ${path}:`, error);
    throw error;
  }
};
