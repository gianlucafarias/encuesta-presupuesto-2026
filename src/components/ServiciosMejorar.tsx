import { useState } from 'react';
import type { FormStepProps } from '../types/survey';

const SERVICIOS_OPCIONES = [
  'Limpieza / recolección de residuos',
  'Mantenimiento de los espacios verdes',
  'Mantenimiento de las calles',
  'Arbolado / poda',
  'Volquete',
];

export default function ServiciosMejorar({ data, onNext, onPrevious, onUpdate }: FormStepProps) {
  const [seleccionadas, setSeleccionadas] = useState<string[]>(data.serviciosMejorar || []);
  const [otro, setOtro] = useState(data.serviciosMejorarOtro || '');
  const [error, setError] = useState('');

  const handleCheckbox = (opcion: string) => {
    if (seleccionadas.includes(opcion)) {
      setSeleccionadas(seleccionadas.filter(o => o !== opcion));
    } else {
      if (seleccionadas.length < 2) {
        setSeleccionadas([...seleccionadas, opcion]);
      } else {
        setError('Sólo puedes elegir hasta 2 opciones');
        setTimeout(() => setError(''), 2000);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (seleccionadas.length === 0 && !otro.trim()) {
      setError('Selecciona al menos una opción o completa "Otro"');
      return;
    }
    onUpdate({ serviciosMejorar: seleccionadas, serviciosMejorarOtro: otro });
    onNext({ serviciosMejorar: seleccionadas, serviciosMejorarOtro: otro });
  };

  return (
    <div className="max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-8">
        <h2 className="text-2xl font-bold mb-4 text-[#006F4B]">¿Qué servicio considerás que debe mejorarse en la ciudad?</h2>
        <p className="text-gray-600 mb-4">(Podés elegir hasta 2 opciones)</p>
        <div className="space-y-3 mb-6">
          {SERVICIOS_OPCIONES.map((opcion) => (
            <label key={opcion} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={seleccionadas.includes(opcion)}
                onChange={() => handleCheckbox(opcion)}
                disabled={!seleccionadas.includes(opcion) && seleccionadas.length >= 2}
                className="h-5 w-5 text-[#006F4B] focus:ring-[#006F4B] border-gray-300 rounded"
              />
              <span className="text-gray-800">{opcion}</span>
            </label>
          ))}
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={!!otro}
              onChange={() => {
                if (otro) setOtro('');
              }}
              className="h-5 w-5 text-[#006F4B] focus:ring-[#006F4B] border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Otro: (escribir para agregar opción)"
              value={otro}
              onChange={e => setOtro(e.target.value)}
              className="flex-1 border-b border-gray-300 focus:border-[#006F4B] outline-none py-1 px-2 text-gray-800 bg-transparent"
              maxLength={60}
            />
          </label>
        </div>
        {error && <div className="text-red-600 mb-4 text-sm">{error}</div>}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            className="bg-gray-100 text-gray-700 py-2 px-6 rounded-xl hover:bg-gray-200 font-semibold"
            onClick={onPrevious}
          >
            Anterior
          </button>
          <button
            type="submit"
            className="bg-gradient-to-r from-[#006F4B] to-[#008F5B] text-white py-2 px-6 rounded-xl font-semibold hover:from-[#008F5B] hover:to-[#006F4B] focus:ring-4 focus:ring-green-100 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Continuar
          </button>
        </div>
      </form>
    </div>
  );
} 