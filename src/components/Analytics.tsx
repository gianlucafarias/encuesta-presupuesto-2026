import { useEffect } from 'react';

interface AnalyticsProps {
  clarityId?: string;
  googleAnalyticsId?: string;
}

export default function Analytics({ clarityId, googleAnalyticsId }: AnalyticsProps) {
  useEffect(() => {
    // Microsoft Clarity
    if (clarityId) {
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", clarityId);
    }

    // Google Analytics (opcional)
    if (googleAnalyticsId) {
      // Google Analytics 4
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      gtag('js', new Date());
      gtag('config', googleAnalyticsId);
    }
  }, [clarityId, googleAnalyticsId]);

  return null; // Este componente no renderiza nada
} 