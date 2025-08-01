// Configuración por entorno
interface Config {
  API_BASE_URL: string;
  ENVIRONMENT: 'development' | 'production';
}

const getConfig = (): Config => {
  const environment = import.meta.env.MODE || 'development';
  
  if (environment === 'production') {
    return {
      API_BASE_URL: import.meta.env.PUBLIC_API_URL || 'https://api.ceres.gob.ar/api/api',
      ENVIRONMENT: 'production'
    };
  }
  
  // Desarrollo
  return {
    API_BASE_URL: 'http://localhost:3001/api',
    ENVIRONMENT: 'development'
  };
};

export const config = getConfig(); 