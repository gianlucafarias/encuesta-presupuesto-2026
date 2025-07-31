import { useState } from 'react';
import type { FormStepProps } from '../types/survey';

const priorityAreas = [
  { key: 'infraestructura', label: 'Infraestructura', description: 'Calles, veredas, iluminación pública' },
  { key: 'salud', label: 'Salud', description: 'Hospitales, centros de salud, atención médica' },
  { key: 'educacion', label: 'Educación', description: 'Escuelas, bibliotecas, programas educativos' },
  { key: 'seguridad', label: 'Seguridad', description: 'Policía, cámaras de seguridad, patrullas' },
  { key: 'transporte', label: 'Transporte', description: 'Colectivos, bicisendas, estacionamientos' },
  { key: 'medioAmbiente', label: 'Medio Ambiente', description: 'Parques, reciclaje, espacios verdes' },
  { key: 'cultura', label: 'Cultura', description: 'Teatros, museos, eventos culturales' },
  { key: 'deportes', label: 'Deportes', description: 'Polideportivos, canchas, actividades deportivas' }
];

export default function InvestmentPriorities({ data, onNext, onPrevious, onUpdate }: FormStepProps) {
  const [priorities, setPriorities] = useState(
    data.prioridades || {
      infraestructura: 0,
      salud: 0,
      educacion: 0,
      seguridad: 0,
      transporte: 0,
      medioAmbiente: 0,
      cultura: 0,
      deportes: 0
    }
  );

  const handlePriorityChange = (key: string, value: number) => {
    setPriorities(prev => ({ ...prev, [key]: value }));
  };

  const validatePriorities = () => {
    const values = Object.values(priorities);
    const hasValues = values.some(v => v > 0);
    const total = values.reduce((sum, val) => sum + val, 0);
    
    return hasValues && total <= 100;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePriorities()) {
      onUpdate({ prioridades: priorities });
      onNext({ prioridades: priorities });
    }
  };

  const getTotalPercentage = () => {
    return Object.values(priorities).reduce((sum, val) => sum + val, 0);
  };

  const totalPercentage = getTotalPercentage();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Prioridades de Inversión
        </h3>
        
        <p className="text-gray-600 mb-6 text-center">
          Asigna un porcentaje de prioridad a cada área. El total no debe superar el 100%.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {priorityAreas.map((area) => (
              <div key={area.key} className="border border-gray-200 rounded-lg p-4">
                <div className="mb-3">
                  <h4 className="font-semibold text-gray-800">{area.label}</h4>
                  <p className="text-sm text-gray-600">{area.description}</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priorities[area.key as keyof typeof priorities]}
                    onChange={(e) => handlePriorityChange(area.key, parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-center">
                    {priorities[area.key as keyof typeof priorities]}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-blue-800">Total asignado:</span>
              <span className={`font-bold text-lg ${
                totalPercentage > 100 ? 'text-red-600' : 
                totalPercentage === 100 ? 'text-green-600' : 'text-blue-600'
              }`}>
                {totalPercentage}%
              </span>
            </div>
            {totalPercentage > 100 && (
              <p className="text-red-600 text-sm mt-2">
                El total no puede superar el 100%. Ajusta los valores.
              </p>
            )}
            {totalPercentage < 100 && totalPercentage > 0 && (
              <p className="text-blue-600 text-sm mt-2">
                Puedes asignar hasta {100 - totalPercentage}% más.
              </p>
            )}
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
              disabled={!validatePriorities()}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
} 