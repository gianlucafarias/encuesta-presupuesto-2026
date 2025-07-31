import { config } from './config';

// Función para validar DNI
export const validarDNI = async (dni: string) => {
  try {
    console.log('🔍 Validando DNI:', dni);
    
    const response = await fetch(`${config.API_BASE_URL}/validar-dni`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dni })
    });

    const data = await response.json();
    console.log('📡 Respuesta del backend:', data);
    console.log('📊 Status:', response.status);
    console.log('✅ Puede continuar:', data.puedeContinuar);
    
    if (!response.ok) {
      throw new Error(data.mensaje || 'Error al validar DNI');
    }

    return data;
  } catch (error) {
    console.error('❌ Error validando DNI:', error);
    throw error;
  }
};

// Función para guardar encuesta
export const guardarEncuesta = async (encuestaData: any) => {
  try {
    const response = await fetch(`${config.API_BASE_URL}/guardar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(encuestaData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.mensaje || 'Error al guardar encuesta');
    }

    return data;
  } catch (error) {
    console.error('Error guardando encuesta:', error);
    throw error;
  }
};

// Función para verificar estado de encuesta
export const verificarEstado = async (id: string) => {
  try {
    const response = await fetch(`${config.API_BASE_URL}/estado/${id}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.mensaje || 'Error al verificar estado');
    }

    return data;
  } catch (error) {
    console.error('Error verificando estado:', error);
    throw error;
  }
}; 