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
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-4 mt-4 sm:mt-6 px-2 sm:px-4" style={{ WebkitOverflowScrolling: 'touch' }}>
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            className={`flex flex-col items-center transition-all duration-300 ${
              step <= currentStep ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <div
              className={`w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 progress-circle ios-optimized ${
                step < currentStep
                  ? 'bg-[#FDBA38] text-white shadow-lg'
                  : step === currentStep
                  ? 'bg-[#006F4B] text-white shadow-lg ring-2 sm:ring-4 ring-green-100'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              {step < currentStep ? (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                step
              )}
            </div>
            <span className={`text-xs mt-2 sm:mt-3 text-center font-medium leading-tight ${
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