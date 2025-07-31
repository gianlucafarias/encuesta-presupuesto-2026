import { useState } from 'react';
import type { SurveyData, SurveyStep } from '../types/survey';
import ProgressBar from './ProgressBar';
import DNIValidator from './DNIValidator';
import BarrioSelection from './BarrioSelection';
import ObrasUrgentes from './ObrasUrgentes';
import ServiciosMejorar from './ServiciosMejorar';
import EspaciosPropuestas from './EspaciosPropuestas';
import ContactoParticipacion from './ContactoParticipacion';
import SurveyConfirmation from './SurveyConfirmation';

export default function SurveyForm() {
  const [currentStep, setCurrentStep] = useState<SurveyStep>(1);
  const [surveyData, setSurveyData] = useState<Partial<SurveyData>>({});

  const handleNext = (data: Partial<SurveyData>) => {
    setSurveyData(prev => ({ ...prev, ...data }));
    setCurrentStep(prev => (prev + 1) as SurveyStep);
  };

  const handlePrevious = () => {
    setCurrentStep(prev => (prev - 1) as SurveyStep);
  };

  const handleUpdate = (data: Partial<SurveyData>) => {
    setSurveyData(prev => ({ ...prev, ...data }));
  };

  const renderCurrentStep = () => {
    const commonProps = {
      currentStep,
      data: surveyData,
      onNext: handleNext,
      onPrevious: handlePrevious,
      onUpdate: handleUpdate,
    };

    switch (currentStep) {
      case 1:
        return <DNIValidator {...commonProps} />;
      case 2:
        return <BarrioSelection {...commonProps} />;
      case 3:
        return <ObrasUrgentes {...commonProps} />;
      case 4:
        return <ServiciosMejorar {...commonProps} />;
      case 5:
        return <EspaciosPropuestas {...commonProps} />;
      case 6:
        return <ContactoParticipacion {...commonProps} />;
      case 7:
        return <SurveyConfirmation {...commonProps} />;
      default:
        return <DNIValidator {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br  py-6 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Layout responsive: centrado en mobile, lado a lado en desktop */}
        <div className="lg:flex lg:items-start lg:gap-12">
          {/* Columna izquierda - Texto introductorio */}
          <div className="lg:w-1/2 lg:sticky lg:top-6">
            <div className="text-center lg:text-left mb-8 lg:mb-0">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-[#006F4B] rounded-full mb-4">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  Encuesta Vecinal
                </h1>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#006F4B] mb-4">
                  Plan de Obras 2026
                </h2>
              </div>
              
              <div className="max-w-2xl lg:max-w-none mx-auto">
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                  Queremos escuchar tu voz. Desde el Gobierno de la ciudad de Ceres estamos planificando el 
                  <span className="font-semibold text-gray-900"> Plan de Obras Públicas para el año 2026 </span>
                   y tu opinión es fundamental para definir las prioridades de cada barrio.
                </p>
              </div>
            </div>
          </div>

          {/* Columna derecha - Formulario */}
          <div className="lg:w-1/2">
            <ProgressBar currentStep={currentStep} totalSteps={7} />
            
            <div className="mt-8">
              {renderCurrentStep()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 