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

    // Configurar función gtag proxy para Partytown
    const setupGtagProxy = () => {
      // Crear proxy de gtag que funcione con Partytown
      if (!window.gtag) {
        window.gtag = function(...args: any[]) {
          // Verificar si dataLayer existe (creado por Partytown)
          if (window.dataLayer) {
            window.dataLayer.push(args);
            console.log('📊 GA4 Event (Partytown):', args);
          } else {
            console.log('⚠️ dataLayer no disponible aún');
          }
        };
      }
    };

    // Configurar trackSurveyEvent para trabajar con Partytown
    const setupTrackingEvents = () => {
      window.trackSurveyEvent = (action: string, data: any = {}) => {
        console.log('📊 Survey Event:', action, data);
        
        // Enviar a Google Analytics via dataLayer (compatible con Partytown)
        if (window.dataLayer) {
          const eventData = {
            event_category: 'Survey',
            event_label: data.label || '',
            custom_parameter_1: data.step || '',
            custom_parameter_2: data.barrio || '',
            custom_parameter_3: data.type || '',
            value: data.value || 0
          };
          
          // Usar dataLayer directamente (más confiable con Partytown)
          window.dataLayer.push(['event', action, eventData]);
          console.log('✅ Evento enviado via dataLayer:', action, eventData);
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
    };

    // Configurar proxy y eventos inmediatamente
    setupGtagProxy();
    setupTrackingEvents();

    // Verificar que dataLayer esté disponible
    const checkDataLayer = () => {
      if (window.dataLayer) {
        console.log('✅ Google Analytics dataLayer detectado');
        
        // Enviar evento inicial usando dataLayer
        window.dataLayer.push(['event', 'survey_loaded', {
          event_category: 'Survey',
          event_label: 'Componente Analytics cargado con Partytown'
        }]);
        
        console.log('✅ Sistema de tracking inicializado correctamente');
      } else {
        console.log('⏳ Esperando dataLayer...');
        setTimeout(checkDataLayer, 500);
      }
    };

    // Verificar dataLayer después de un tiempo corto
    setTimeout(checkDataLayer, 1000);

  }, [clarityId, googleAnalyticsId]);

  return null; // Este componente no renderiza nada
} 