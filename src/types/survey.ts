export interface SurveyData {
  // Paso 1: Validación DNI
  dni: string;
  
  // Paso 2: Selección de barrio
  barrio: string;
  
  // Paso 3: Obras urgentes (máximo 3 opciones)
  obrasUrgentes: string[];
  obrasUrgentesOtro: string;
  
  // Paso 4: Servicios a mejorar (máximo 2 opciones)
  serviciosMejorar: string[];
  serviciosMejorarOtro: string;
  
  // Paso 5: Espacios específicos y propuestas
  espacioMejorar: string;
  propuesta: string;
  
  // Paso 6: Contacto para participación
  quiereContacto: boolean;
  nombreCompleto: string;
  telefono: string;
  email: string;

  // Paso 7: Comentarios y sugerencias
  comentarios: string;
  sugerencias: string;
}

export type SurveyStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface FormStepProps {
  currentStep: SurveyStep;
  data: Partial<SurveyData>;
  onNext: (data: Partial<SurveyData>) => void;
  onPrevious: () => void;
  onUpdate: (data: Partial<SurveyData>) => void;
} 