import { useEffect } from 'react';

interface AnalyticsProps {
  clarityId?: string;
  googleAnalyticsId?: string;
}

// Función global para tracking de eventos personalizados
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    trackSurveyEvent: (action: string, data?: any) => void;
    clarity: (action: string, data?: any) => void;
    [key: string]: any; // Para permitir índices dinámicos en window
  }
}

export default function Analytics({ clarityId, googleAnalyticsId }: AnalyticsProps) {
  useEffect(() => {
    // Microsoft Clarity
    if (clarityId) {
      // Función de inicialización de Clarity con tipos seguros
      const initClarity = (c: any, l: Document, a: string, r: string, i: string) => {
        c[a] = c[a] || function(...args: any[]) { 
          (c[a].q = c[a].q || []).push(args); 
        };
        const script = l.createElement(r) as HTMLScriptElement;
        script.async = true;
        script.src = "https://www.clarity.ms/tag/" + i;
        const firstScript = l.getElementsByTagName(r)[0];
        if (firstScript && firstScript.parentNode) {
          firstScript.parentNode.insertBefore(script, firstScript);
        }
      };
      
      initClarity(window, document, "clarity", "script", clarityId);
      console.log('✅ Microsoft Clarity iniciado:', clarityId);
    }

    // Verificar y configurar sistema de tracking después de un tiempo
    setTimeout(() => {
      // Backup de trackSurveyEvent si no existe (debería existir desde index.astro)
      if (!window.trackSurveyEvent) {
        console.log('⚠️ trackSurveyEvent no encontrado, creando backup...');
        window.trackSurveyEvent = (action: string, data: any = {}) => {
          console.log('📊 Survey Event (backup):', action, data);
          
          // Enviar a Google Analytics si está disponible
          if (window.gtag) {
            window.gtag('event', action, {
              event_category: 'Survey',
              event_label: data.label || '',
              custom_parameter_1: data.step || '',
              custom_parameter_2: data.barrio || '',
              custom_parameter_3: data.type || '',
              value: data.value || 0
            });
          }
          
          // Enviar a Clarity si está disponible
          if (window.clarity) {
            try {
              window.clarity('set', `survey_${action}`);
            } catch (e) {
              console.log('Clarity tracking error:', e);
            }
          }
        };
      }

      // Confirmar que todo está funcionando
      console.log('✅ Sistema de tracking básico inicializado correctamente');
      
      // Enviar evento de confirmación
      window.trackSurveyEvent('analytics_component_loaded', {
        step: 'initialization',
        type: 'system',
        label: 'Componente Analytics cargado'
      });
    }, 1000);

  }, [clarityId, googleAnalyticsId]);

  return null; // Este componente no renderiza nada
} 