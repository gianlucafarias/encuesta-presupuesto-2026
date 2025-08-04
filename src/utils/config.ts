// Configuración por entorno
interface Config {
  API_BASE_URL: string;
  ENVIRONMENT: 'development' | 'production';
  RECAPTCHA_SITE_KEY: string;
}

const getConfig = (): Config => {
  const environment = import.meta.env.MODE || 'development';
  
  if (environment === 'production') {
    return {
      API_BASE_URL: import.meta.env.PUBLIC_API_URL,
      ENVIRONMENT: 'production',
      RECAPTCHA_SITE_KEY: import.meta.env.PUBLIC_RECAPTCHA_SITE_KEY || ''
    };
  }
  
  // Desarrollo
  return {
    API_BASE_URL: import.meta.env.PUBLIC_API_URL,
    ENVIRONMENT: 'development',
    RECAPTCHA_SITE_KEY: import.meta.env.PUBLIC_RECAPTCHA_SITE_KEY || ''
  };
};

export const config = getConfig(); 