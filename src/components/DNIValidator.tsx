import { useState } from 'react';
import type { FormStepProps } from '../types/survey';
import { validarDNI } from '../utils/api';

export default function DNIValidator({ onNext, onUpdate }: FormStepProps) {
  const [dni, setDni] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateDNI = async () => {
    if (!dni || dni.length < 7) {
      setError('Por favor ingrese un DNI válido');
      return;
    }

    if (!aceptaTerminos) {
      setError('Debe aceptar los términos y condiciones para continuar');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('🚀 Iniciando validación para DNI:', dni);
      const response = await validarDNI(dni);
      console.log('📋 Respuesta recibida:', response);
      
      if (response.puedeContinuar) {
        console.log('✅ DNI válido, continuando...');
        onUpdate({ dni });
        onNext({ dni });
      } else {
        console.log('❌ DNI ya existe, mostrando error');
        setError(response.mensaje || 'Este DNI ya ha completado la encuesta anteriormente');
      }
    } catch (err: any) {
      console.log('💥 Error en validación:', err);
      setError(err.message || 'Error al validar el DNI. Por favor intente nuevamente.');
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
              Para participar en la encuesta de presupuesto 2026, necesitamos validar tu identidad.
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
                    onClick={() => window.open('/terminos-condiciones', '_blank')}
                  >
                    términos y condiciones.
                  </button>
                </label>
              </div>
              
              <p className="text-xs text-gray-500 leading-relaxed">
                Al marcar esta casilla, confirmas que has leído y aceptas nuestra política de privacidad y el uso de tus datos para el análisis de la encuesta vecinal.
              </p>
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
              disabled={isLoading || !dni || !aceptaTerminos}
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
    </div>
  );
} 