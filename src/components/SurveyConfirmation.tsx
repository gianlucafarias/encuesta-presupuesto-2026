import type { FormStepProps } from '../types/survey';

export default function SurveyConfirmation({ data }: FormStepProps) {
  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header del paso */}
        <div className="bg-gradient-to-r from-[#006F4B] to-[#008F5B] px-6 py-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            ¡Encuesta Enviada!
          </h3>

        </div>

        {/* Contenido */}
        <div className="px-6 py-8 text-center">
          <div className="mb-8">
            <p className="text-gray-600 text-base leading-relaxed mb-6">
              Tu opinión es muy importante para nosotros. Los resultados de esta encuesta serán utilizados para planificar el Plan de Obras 2026.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-green-800 mb-4">
                Resumen de tu participación:
              </h4>
              <div className="space-y-2 text-sm text-green-700">
                <p><span className="font-medium">DNI registrado:</span> {data.dni}</p>
                <p><span className="font-medium">Barrio:</span> {data.barrio}</p>
                <p><span className="font-medium">Fecha de envío:</span> {new Date().toLocaleDateString('es-AR')}</p>
                <p><span className="font-medium">Hora:</span> {new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-[#006F4B] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">
                  <span className="font-semibold">Próximos pasos:</span> Los resultados serán publicados en la página web de la Municipalidad y en las redes sociales oficiales.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mobile-button bg-gradient-to-r from-[#006F4B] to-[#008F5B] text-white py-4 px-8 rounded-xl hover:from-[#008F5B] hover:to-[#006F4B] focus:ring-4 focus:ring-green-100 focus:ring-offset-2 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Completar Nueva Encuesta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 