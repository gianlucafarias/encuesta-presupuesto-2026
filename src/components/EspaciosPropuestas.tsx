import { useState } from 'react';
import type { FormStepProps } from '../types/survey';

export default function EspaciosPropuestas({ data, onNext, onPrevious, onUpdate }: FormStepProps) {
  const [formData, setFormData] = useState({
    espacioMejorar: data.espacioMejorar || '',
    propuesta: data.propuesta || ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.espacioMejorar.trim() && formData.espacioMejorar.length < 10) {
      newErrors.espacioMejorar = 'La descripción debe tener al menos 10 caracteres';
    }

    if (formData.propuesta.trim() && formData.propuesta.length < 10) {
      newErrors.propuesta = 'La propuesta debe tener al menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onUpdate(formData);
      onNext(formData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getCharacterCount = (text: string) => {
    return text.length;
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header del paso */}
        <div className="bg-gradient-to-r from-[#006F4B] to-[#008F5B] px-6 py-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Espacios y Propuestas
          </h3>
          <p className="text-green-100 text-sm sm:text-base">
            Paso 5 de 7
          </p>
        </div>

        {/* Contenido */}
        <div className="px-6 py-8">
          <div className="text-center mb-8">
            <p className="text-gray-600 text-base leading-relaxed">
              Comparte tus ideas específicas para mejorar tu barrio. Todos los campos son opcionales.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="espacioMejorar" className="block text-sm font-semibold text-gray-700 mb-3">
                ¿Qué espacio de tu barrio te gustaría que se mejore o intervenga?
                <span className="text-gray-500 font-normal"> (opcional)</span>
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Ejemplo: una plaza, una calle específica, una esquina peligrosa, etc.
              </p>
              <textarea
                id="espacioMejorar"
                value={formData.espacioMejorar}
                onChange={(e) => handleInputChange('espacioMejorar', e.target.value)}
                rows={4}
                className={`mobile-input w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-[#006F4B] transition-all duration-200 resize-none ${
                  errors.espacioMejorar ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Describe el espacio específico que te gustaría que se mejore..."
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                {errors.espacioMejorar && (
                  <p className="text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.espacioMejorar}
                  </p>
                )}
                <span className="text-sm text-gray-500 ml-auto">
                  {getCharacterCount(formData.espacioMejorar)}/500 caracteres
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="propuesta" className="block text-sm font-semibold text-gray-700 mb-3">
                ¿Tenés alguna propuesta o idea para mejorar tu barrio?
                <span className="text-gray-500 font-normal"> (opcional)</span>
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Tu opinión es muy valiosa para nosotros.
              </p>
              <textarea
                id="propuesta"
                value={formData.propuesta}
                onChange={(e) => handleInputChange('propuesta', e.target.value)}
                rows={4}
                className={`mobile-input w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-[#006F4B] transition-all duration-200 resize-none ${
                  errors.propuesta ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Comparte tu propuesta o idea..."
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                {errors.propuesta && (
                  <p className="text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.propuesta}
                  </p>
                )}
                <span className="text-sm text-gray-500 ml-auto">
                  {getCharacterCount(formData.propuesta)}/500 caracteres
                </span>
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
                    <span className="font-semibold">Nota:</span> Puedes continuar sin completar estos campos si no tienes propuestas específicas en este momento.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onPrevious}
                className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-xl hover:bg-gray-200 font-semibold text-lg"
              >
                Anterior
              </button>
              
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-[#006F4B] to-[#008F5B] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-[#008F5B] hover:to-[#006F4B] focus:ring-4 focus:ring-green-100 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Continuar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 