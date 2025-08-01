import { useState } from 'react';
import type { FormStepProps } from '../types/survey';

export default function Comments({ data, onNext, onPrevious, onUpdate }: FormStepProps) {
  const [formData, setFormData] = useState({
    comentarios: data.comentarios || '',
    sugerencias: data.sugerencias || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.comentarios.trim()) {
      newErrors.comentarios = 'Por favor compartí tus comentarios sobre el presupuesto';
    } else if (formData.comentarios.length < 10) {
      newErrors.comentarios = 'El comentario debe tener al menos 10 caracteres';
    }

    if (formData.sugerencias && formData.sugerencias.length < 10) {
      newErrors.sugerencias = 'La sugerencia debe tener al menos 10 caracteres';
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
    <div className="max-w-3xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Comentarios y Sugerencias
        </h3>
        
        <p className="text-gray-600 mb-6 text-center">
          Compartí tus opiniones y sugerencias para mejorar el presupuesto 2026.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="comentarios" className="block text-sm font-medium text-gray-700 mb-2">
              Comentarios sobre el presupuesto *
            </label>
            <textarea
              id="comentarios"
              value={formData.comentarios}
              onChange={(e) => handleInputChange('comentarios', e.target.value)}
              rows={6}
              className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                errors.comentarios ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Compartí tus comentarios sobre cómo debería distribuirse el presupuesto municipal..."
              maxLength={1000}
            />
            <div className="flex justify-between items-center mt-2">
              {errors.comentarios && (
                <p className="text-sm text-red-600">{errors.comentarios}</p>
              )}
              <span className="text-sm text-gray-500 ml-auto">
                {getCharacterCount(formData.comentarios)}/1000 caracteres
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="sugerencias" className="block text-sm font-medium text-gray-700 mb-2">
              Sugerencias específicas (opcional)
            </label>
            <textarea
              id="sugerencias"
              value={formData.sugerencias}
              onChange={(e) => handleInputChange('sugerencias', e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                errors.sugerencias ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="¿Tenés alguna sugerencia específica para proyectos o mejoras en tu barrio? (opcional)"
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-2">
              {errors.sugerencias && (
                <p className="text-sm text-red-600">{errors.sugerencias}</p>
              )}
              <span className="text-sm text-gray-500 ml-auto">
                {getCharacterCount(formData.sugerencias)}/500 caracteres
              </span>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Tu opinión es importante
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Los comentarios y sugerencias que compartas serán considerados en la planificación del presupuesto 2026.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={onPrevious}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Anterior
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Revisar y Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 