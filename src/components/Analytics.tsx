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
    }

    // Google Analytics 4
    if (googleAnalyticsId) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      gtag('js', new Date());
      gtag('config', googleAnalyticsId, {
        page_title: 'Plan de Obras 2026 - Encuesta Vecinal',
        page_location: window.location.href,
        custom_map: {
          'custom_parameter_1': 'survey_step',
          'custom_parameter_2': 'barrio',
          'custom_parameter_3': 'action_type'
        }
      });

      // Función global para tracking de eventos de la encuesta
      window.gtag = gtag;
      window.trackSurveyEvent = (action: string, data: any = {}) => {
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
        
        // También enviar a Clarity si está disponible
        if (window.clarity) {
          try {
            window.clarity('set', `survey_${action}`);
          } catch (e) {
            console.log('Clarity tracking error:', e);
          }
        }
      };

      // Eventos automáticos
      gtag('event', 'page_view', {
        event_category: 'Survey',
        event_label: 'Encuesta Iniciada'
      });
    }
  }, [clarityId, googleAnalyticsId]);

  return null; // Este componente no renderiza nada
} 