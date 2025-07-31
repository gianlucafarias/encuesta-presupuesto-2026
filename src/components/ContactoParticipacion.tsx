import { useState } from 'react';
import type { FormStepProps } from '../types/survey';
import { guardarEncuesta } from '../utils/api';

export default function ContactoParticipacion({ data, onNext, onPrevious, onUpdate }: FormStepProps) {
  const [formData, setFormData] = useState({
    quiereContacto: data.quiereContacto || false,
    nombreCompleto: data.nombreCompleto || '',
    telefono: data.telefono || '',
    email: data.email || ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.quiereContacto) {
      if (!formData.nombreCompleto.trim()) {
        newErrors.nombreCompleto = 'El nombre y apellido son requeridos';
      }
      if (!formData.telefono.trim()) {
        newErrors.telefono = 'El teléfono es requerido';
      }
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'El email no es válido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        const encuestaCompleta = {
          ...data,
          ...formData
        };

        const response = await guardarEncuesta(encuestaCompleta);
        
        onUpdate(formData);
        onNext(formData);
        
      } catch (err: any) {
        setErrors({ submit: err.message || 'Error al enviar la encuesta. Por favor intente nuevamente.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header del paso */}
        <div className="bg-gradient-to-r from-[#006F4B] to-[#008F5B] px-6 py-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Contacto para Participación
          </h3>
          <p className="text-green-100 text-sm sm:text-base">
            Paso 6 de 7
          </p>
        </div>

        {/* Contenido */}
        <div className="px-6 py-8">
          <div className="text-center mb-8">
            <p className="text-gray-600 text-base leading-relaxed">
              ¿Te gustaría que te contactemos para participar en los encuentros barriales o mesas de trabajo?
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-[#006F4B] transition-colors">
                <input
                  type="radio"
                  id="si"
                  name="quiereContacto"
                  checked={formData.quiereContacto === true}
                  onChange={() => handleInputChange('quiereContacto', true)}
                  className="h-5 w-5 text-[#006F4B] focus:ring-[#006F4B] border-gray-300"
                />
                <label htmlFor="si" className="text-base text-gray-700 font-medium">
                  Sí, me interesa participar
                </label>
              </div>
              
              <div className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-[#006F4B] transition-colors">
                <input
                  type="radio"
                  id="no"
                  name="quiereContacto"
                  checked={formData.quiereContacto === false}
                  onChange={() => handleInputChange('quiereContacto', false)}
                  className="h-5 w-5 text-[#006F4B] focus:ring-[#006F4B] border-gray-300"
                />
                <label htmlFor="no" className="text-base text-gray-700 font-medium">
                  No, gracias
                </label>
              </div>
            </div>

            {formData.quiereContacto && (
              <div className="border-t border-gray-200 pt-6 space-y-4">
                <h4 className="text-lg font-semibold text-gray-800">
                  Datos de contacto:
                </h4>
                
                <div>
                  <label htmlFor="nombreCompleto" className="block text-sm font-semibold text-gray-700 mb-3">
                    Nombre y apellido *
                  </label>
                  <input
                    type="text"
                    id="nombreCompleto"
                    value={formData.nombreCompleto}
                    onChange={(e) => handleInputChange('nombreCompleto', e.target.value)}
                    className={`mobile-input w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-[#006F4B] transition-all duration-200 ${
                      errors.nombreCompleto ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="Tu nombre completo"
                  />
                  {errors.nombreCompleto && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.nombreCompleto}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="telefono" className="block text-sm font-semibold text-gray-700 mb-3">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    className={`mobile-input w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-[#006F4B] transition-all duration-200 ${
                      errors.telefono ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="Tu número de teléfono"
                  />
                  {errors.telefono && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.telefono}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                    Email (opcional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`mobile-input w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-[#006F4B] transition-all duration-200 ${
                      errors.email ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="tu@email.com"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
            )}

            {errors.submit && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-4 rounded-xl text-sm flex items-center">
                <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.submit}
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onPrevious}
                disabled={isSubmitting}
                className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-xl hover:bg-gray-200 font-semibold text-lg disabled:opacity-50"
              >
                Anterior
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-[#006F4B] to-[#008F5B] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-[#008F5B] hover:to-[#006F4B] focus:ring-4 focus:ring-green-100 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  'Enviar Encuesta'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 