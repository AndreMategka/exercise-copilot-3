/**
 * API utility for building the base URL.
 *
 * Requires VITE_CODESPACE_NAME to be defined in .env.local or environment:
 * VITE_CODESPACE_NAME=your-codespace-name
 *
 * If VITE_CODESPACE_NAME is not set, falls back to localhost:8000
 */

const getApiBaseUrl = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
  
  if (codespaceName && codespaceName !== 'undefined') {
    return `https://${codespaceName}-8000.app.github.dev`;
  }
  
  // Fallback to localhost for local development
  return 'http://localhost:8000';
};

export const apiBaseUrl = getApiBaseUrl();

/**
 * Fetch data from an API endpoint with error handling
 */
export const fetchApiData = async (path) => {
  try {
    const url = `${apiBaseUrl}${path}`;
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
