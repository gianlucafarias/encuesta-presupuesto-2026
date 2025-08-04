import { useState, useRef, useEffect } from 'react';
import type { FormStepProps } from '../types/survey';
import { validarDNI } from '../utils/api';
import { config } from '../utils/config';

// Importación dinámica para evitar problemas de SSR
let ReCAPTCHA: any = null;

export default function DNIValidator({ onNext, onUpdate }: FormStepProps) {
  const [dni, setDni] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTerminos, setShowTerminos] = useState(false);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const recaptchaRef = useRef<any>(null);

  // Cargar ReCAPTCHA solo en el cliente
  useEffect(() => {
    const loadReCAPTCHA = async () => {
      if (typeof window !== 'undefined') {
        try {
          const ReCAPTCHAModule = await import('react-google-recaptcha');
          ReCAPTCHA = ReCAPTCHAModule.default;
          setIsClient(true);
        } catch (error) {
          // Error silencioso para producción
        }
      }
    };

    loadReCAPTCHA();
  }, []);

  const validateDNI = async () => {
    if (!dni || dni.length < 7) {
      setError('Por favor ingrese un DNI válido');
      return;
    }

    if (!aceptaTerminos) {
      setError('Debe aceptar los términos y condiciones para continuar');
      return;
    }

    if (!!config.RECAPTCHA_SITE_KEY && isClient && !captchaValue) {
      setError('Por favor complete la verificación de seguridad (captcha)');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await validarDNI(dni);
      
      if (response.puedeContinuar) {
        // Analytics: DNI validado exitosamente
        if (window.trackSurveyEvent) {
          window.trackSurveyEvent('dni_validation_success', {
            step: 'dni_validator',
            type: 'validation',
            label: 'DNI válido - continuando a paso 2'
          });
        }
        
        onUpdate({ dni });
        onNext({ dni });
      } else {
        // Analytics: DNI ya utilizado
        if (window.trackSurveyEvent) {
          window.trackSurveyEvent('dni_validation_failed', {
            step: 'dni_validator',
            type: 'validation',
            label: 'DNI ya utilizado anteriormente'
          });
        }
        
        setError(response.mensaje || 'Este DNI ya ha completado la encuesta anteriormente');
        // Resetear captcha
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
          setCaptchaValue(null);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Error al validar el DNI. Por favor intente nuevamente.');
      // Resetear captcha en caso de error
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
        setCaptchaValue(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateDNI();
  };

  const handleCheckboxChange = () => {
    setAceptaTerminos(!aceptaTerminos);
    if (error && error.includes('términos')) {
      setError('');
    }
  };

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
    if (error && error.includes('captcha')) {
      setError('');
    }
  };

  const handleCaptchaExpired = () => {
    setCaptchaValue(null);
    setError('La verificación de seguridad ha expirado. Por favor, complete el captcha nuevamente.');
  };

  const openTerminos = () => {
    setShowTerminos(true);
    
    // Analytics: Usuario abrió términos y condiciones
    if (window.trackSurveyEvent) {
      window.trackSurveyEvent('terms_opened', {
        step: 'dni_validator',
        type: 'interaction',
        label: 'Usuario abrió modal de términos y condiciones'
      });
    }
  };

  const closeTerminos = () => {
    setShowTerminos(false);
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header del paso */}
        <div className="bg-gradient-to-r from-[#006F4B] to-[#008F5B] px-6 py-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Validación de Identidad
          </h3>
          <p className="text-green-100 text-sm sm:text-base">
            Paso 1 de 7
          </p>
        </div>

        {/* Contenido */}
        <div className="px-6 py-8">
          <div className="text-center mb-8">
            <p className="text-gray-600 text-base leading-relaxed">
              Para participar en la encuesta de Plan de Obras 2026, necesitamos validar tu identidad.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="dni" className="block text-sm font-semibold text-gray-700 mb-3">
                Número de Documento (DNI)
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="dni"
                  value={dni}
                  onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                  className="mobile-input w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-[#006F4B] transition-all duration-200 text-lg text-center font-mono tracking-wider"
                  placeholder="12345678"
                  maxLength={8}
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Términos y condiciones */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-[#006F4B] transition-colors">
                <input
                  type="checkbox"
                  id="terminos"
                  checked={aceptaTerminos}
                  onChange={handleCheckboxChange}
                  className="h-5 w-5 text-[#006F4B] focus:ring-[#006F4B] border-gray-300 rounded mt-0.5"
                  disabled={isLoading}
                />
                <label htmlFor="terminos" className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-medium">Estoy de acuerdo con los </span>
                  <button
                    type="button"
                    className="text-[#006F4B] hover:text-[#008F5B] underline font-medium"
                    onClick={openTerminos}
                  >
                    términos y condiciones.
                  </button>
                </label>
              </div>
              
              <p className="text-xs text-gray-500 leading-relaxed">
                Al marcar esta casilla, confirmas que has leído y aceptas nuestra política de privacidad y el uso de tus datos para el análisis de la encuesta vecinal.
              </p>
            </div>

            {/* Captcha de seguridad */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Verificación de seguridad
              </label>
              <div className="flex justify-center">
                {!isClient ? (
                  <div className="bg-blue-50 border-2 border-blue-200 text-blue-700 px-4 py-3 rounded-xl text-sm flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Cargando verificación de seguridad...
                  </div>
                ) : !!config.RECAPTCHA_SITE_KEY && ReCAPTCHA ? (
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={config.RECAPTCHA_SITE_KEY}
                    onChange={handleCaptchaChange}
                    onExpired={handleCaptchaExpired}
                    theme="light"
                    size="normal"
                  />
                ) : (
                  <div className="bg-yellow-50 border-2 border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl text-sm">
                    ⚠️ Captcha no configurado. Contacte al administrador.
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-4 rounded-xl text-sm flex items-center">
                <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={
                isLoading || 
                !dni || 
                !aceptaTerminos || 
                (!!config.RECAPTCHA_SITE_KEY && isClient && !captchaValue)
              }
              className="mobile-button w-full bg-gradient-to-r from-[#006F4B] to-[#008F5B] text-white py-4 px-6 rounded-xl hover:from-[#008F5B] hover:to-[#006F4B] focus:ring-4 focus:ring-green-100 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Validando...
                </span>
              ) : (
                'Continuar'
              )}
            </button>
          </form>

          <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-[#006F4B] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">
                  <span className="font-semibold">Importante:</span> Solo se permite completar la encuesta una vez por persona.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Términos y Condiciones */}
      {showTerminos && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Header del modal */}
            <div className="px-6 py-6 text-center">
              <div className="flex items-center justify-between">
                <h3 className="text-xl sm:text-2xl font-bold text-[#006F4B]">
                  Términos y Condiciones
                </h3>
                <button
                  onClick={closeTerminos}
                  className="text-white hover:text-gray-200 transition-colors p-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido del modal */}
            <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-6 text-gray-700">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-[#006F4B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-gray-800">
                    Política de Privacidad y Uso de Datos
                  </p>
                </div>

                <div className="bg-green-50 border-l-4 border-[#006F4B] p-4 rounded-r-lg">
                  <h4 className="font-bold text-[#006F4B] mb-2">1. Confidencialidad de Datos</h4>
                  <p className="text-sm leading-relaxed">
                    Todos los datos personales proporcionados en esta encuesta son completamente <strong>confidenciales y privados</strong>. 
                    Su información personal NO será compartida, publicada o divulgada de ninguna manera.
                  </p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <h4 className="font-bold text-blue-700 mb-2">2. Finalidad del DNI</h4>
                  <p className="text-sm leading-relaxed">
                    El número de documento (DNI) se solicita únicamente para <strong>garantizar la participación democrática</strong> 
                    y asegurar que cada persona pueda completar la encuesta <strong>una sola vez</strong>, 
                    manteniendo así la integridad del proceso participativo.
                  </p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                  <h4 className="font-bold text-amber-700 mb-2">3. Uso de la Información</h4>
                  <p className="text-sm leading-relaxed">
                    Los datos recopilados serán utilizados exclusivamente para:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                    <li>Planificación del presupuesto municipal 2026</li>
                    <li>Generación de informes agregados y anónimos</li>
                  </ul>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                  <h4 className="font-bold text-purple-700 mb-2">4. Protección de Datos</h4>
                  <p className="text-sm leading-relaxed">
                    La Municipalidad de Ceres se compromete a proteger su información personal de acuerdo con la 
                    <strong> Ley 25.326 de Protección de Datos Personales</strong> y las mejores prácticas de seguridad informática.
                  </p>
                </div>

                <div className="bg-gray-50 border-l-4 border-gray-500 p-4 rounded-r-lg">
                  <h4 className="font-bold text-gray-700 mb-2">5. Derechos del Ciudadano</h4>
                  <p className="text-sm leading-relaxed">
                    Usted tiene derecho a acceder, rectificar o solicitar la eliminación de sus datos personales 
                    contactando a la Municipalidad de Ceres a través de los canales oficiales.
                  </p>
                </div>

                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Al aceptar estos términos, confirma que ha leído y comprende esta política de privacidad.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    <strong>Gobierno de la Ciudad de Ceres - Plan de Obras 2026</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Footer del modal */}
            <div className="px-6 py-2 bg-gray-50 border-t border-gray-200">
              <button
                onClick={closeTerminos}
                className="cursor-pointer w-full bg-gradient-to-r from-[#006F4B] to-[#008F5B] text-white py-2 rounded-xl hover:from-[#008F5B] hover:to-[#006F4B] focus:ring-4 focus:ring-green-100 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 