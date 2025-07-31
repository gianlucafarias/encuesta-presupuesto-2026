import { useState } from 'react';
import type { FormStepProps } from '../types/survey';

const barrios = [
  'Juan Pablo II',
  'Guillermo Decker',
  'General López / Cooperativas',
  'Instituto',
  'Pedro de Vega',
  'Nuevo',
  'Malvinas Argentinas',
  'El Silencio',
  '9 de Julio',
  'España',
  'Nazer',
  'Re',
  'Irigoyen',
  'Belgrano',
  'Quilmes',
  'Las Américas',
  'Residencial Las Américas',
  'Primera Junta',
  'Nueva Esperanza',
  'Estadio Municipal',
  'San Vicente',
  'Unión',
  'Monseñor Zazpe'
];

export default function BarrioSelection({ data, onNext, onPrevious, onUpdate }: FormStepProps) {
  const [barrio, setBarrio] = useState(data.barrio || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!barrio.trim()) {
      setError('Por favor selecciona tu barrio');
      return;
    }

    setError('');
    onUpdate({ barrio });
    onNext({ barrio });
  };

  const handleBarrioChange = (value: string) => {
    setBarrio(value);
    if (error) setError('');
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          ¿A qué barrio pertenecés?
        </h3>
        
        <p className="text-gray-600 mb-6 text-center">
          Selecciona tu barrio para continuar con la encuesta.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="barrio" className="block text-sm font-medium text-gray-700 mb-2">
              Barrio *
            </label>
            <select
              id="barrio"
              value={barrio}
              onChange={(e) => handleBarrioChange(e.target.value)}
              className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Selecciona tu barrio</option>
              {barrios.map((barrioOption) => (
                <option key={barrioOption} value={barrioOption}>
                  {barrioOption}
                </option>
              ))}
            </select>
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Importante:</strong> Esta información nos ayudará a priorizar las obras según las necesidades de cada barrio.
            </p>
          </div>

          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={onPrevious}
              className="bg-gray-100 text-gray-700 py-2 px-6 rounded-xl hover:bg-gray-200 font-semibold"
            >
              Anterior
            </button>
            <button
              type="submit"
              disabled={!barrio}
              className="bg-gradient-to-r from-[#006F4B] to-[#008F5B] text-white py-2 px-6 rounded-xl font-semibold hover:from-[#008F5B] hover:to-[#006F4B] focus:ring-4 focus:ring-green-100 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 