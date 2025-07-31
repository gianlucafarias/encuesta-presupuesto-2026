import type { SurveyStep } from '../types/survey';

interface ProgressBarProps {
  currentStep: SurveyStep;
  totalSteps: number;
}

const stepLabels = {
  1: 'DNI',
  2: 'Barrio',
  3: 'Obras',
  4: 'Servicios',
  5: 'Espacios',
  6: 'Contacto',
  7: 'Enviado'
};

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
     

      {/* Pasos individuales */}
      <div className="flex justify-between mt-6 px-2">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            className={`flex flex-col items-center transition-all duration-300 ${
              step <= currentStep ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                step < currentStep
                  ? 'bg-[#FDBA38] text-white shadow-lg'
                  : step === currentStep
                  ? 'bg-[#006F4B] text-white shadow-lg ring-4 ring-green-100'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              {step < currentStep ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                step
              )}
            </div>
            <span className={`text-xs mt-2 text-center max-w-16 font-medium ${
              step <= currentStep ? 'text-gray-900' : 'text-gray-400'
            }`}>
              {stepLabels[step as SurveyStep]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 