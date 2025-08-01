// Configuración por entorno
interface Config {
  API_BASE_URL: string;
  ENVIRONMENT: 'development' | 'production';
}

const getConfig = (): Config => {
  const environment = import.meta.env.MODE || 'development';
  
  if (environment === 'production') {
    return {
      API_BASE_URL: import.meta.env.PUBLIC_API_URL,
      ENVIRONMENT: 'production'
    };
  }
  
  // Desarrollo
  return {
    API_BASE_URL: import.meta.env.PUBLIC_API_URL,
    ENVIRONMENT: 'development'
  };
};

export const config = getConfig(); 