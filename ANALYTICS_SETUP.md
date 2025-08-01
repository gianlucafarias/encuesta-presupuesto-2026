# 📊 Guía Completa de Configuración Analytics y Looker Studio

## 🎯 1. Google Analytics 4

### Crear Propiedad
1. Ve a [Google Analytics](https://analytics.google.com/)
2. Crea una cuenta si no tienes una
3. **Crear Propiedad**:
   - Nombre: "Plan de Obras 2026 - Ceres"
   - País: Argentina
   - Moneda: Peso argentino (ARS)
   - Zona horaria: Argentina

### Configurar Stream de Datos
1. Selecciona "Web" como plataforma
2. **URL del sitio web**: `https://encuesta.ceres.gob.ar`
3. **Nombre del stream**: "Encuesta Vecinal"
4. Obtén tu **ID de medición** (formato: `G-XXXXXXXXXX`)

### Variables de Entorno
Agrega en tu archivo `.env.local`:
```bash
PUBLIC_GA_ID=G-XXXXXXXXXX  
```

---

## 🔍 2. Microsoft Clarity

### Crear Proyecto
1. Ve a [Microsoft Clarity](https://clarity.microsoft.com/)
2. Inicia sesión con tu cuenta Microsoft
3. **Crear nuevo proyecto**:
   - Nombre: "Encuesta Plan de Obras 2026"
   - URL: `https://encuesta.ceres.gob.ar`
   - Categoría: Government/Public Services

### Obtener ID
1. Copia el **Project ID** del dashboard
2. Agrega en tu archivo `.env.local`:
```bash
PUBLIC_CLARITY_ID=tu_project_id_aqui
```

---

## 📈 3. Eventos Personalizados Configurados

Tu aplicación ya tiene configurados estos eventos automáticos:

### Eventos de Navegación
- `survey_step_completed` - Cuando se completa un paso
- `survey_started` - Al iniciar la encuesta
- `survey_completed` - Al finalizar la encuesta
- `dni_validation` - Validación de DNI exitosa/fallida

### Eventos de Interacción
- `barrio_selected` - Selección de barrio
- `priority_selected` - Prioridades de inversión
- `terms_viewed` - Visualización de términos y condiciones

### Uso en Componentes
```javascript
// Ejemplo: En cualquier componente puedes usar:
window.trackSurveyEvent('step_completed', {
  step: 'barrio_selection',
  barrio: 'Centro',
  type: 'navigation',
  label: 'Usuario seleccionó barrio Centro'
});
```

---

## 🎨 4. Configuración de Looker Studio

### 4.1 Conectar Google Analytics

1. Ve a [Looker Studio](https://datastudio.google.com/)
2. **Crear nuevo informe**
3. **Agregar fuente de datos** → Google Analytics
4. Selecciona tu propiedad "Plan de Obras 2026 - Ceres"
5. Configura estas dimensiones clave:
   - Páginas vistas
   - Eventos personalizados
   - Ubicación geográfica
   - Dispositivo/navegador

### 4.2 Conectar Endpoints del Backend

#### Opción A: Google Sheets + API
1. Crea un Google Sheet
2. Usa Google Apps Script para llamar tus endpoints:
```javascript
function importSurveyData() {
  const response = UrlFetchApp.fetch('https://tu-backend.com/api/encuesta/estadisticas');
  const data = JSON.parse(response.getContentText());
  // Procesar y escribir datos en el sheet
}
```

#### Opción B: BigQuery (Recomendado)
1. Configura BigQuery en Google Cloud
2. Crea datasets para:
   - `encuesta_responses` - Respuestas de encuesta
   - `analytics_events` - Eventos de GA4
   - `clarity_sessions` - Datos de Clarity

3. ETL automático con Cloud Functions:
```javascript
exports.syncSurveyData = functions.pubsub.schedule('every 1 hours').onRun(async (context) => {
  // Llamar API del backend
  // Insertar en BigQuery
});
```

### 4.3 Métricas Clave para Dashboard

#### Panel Principal
- **KPIs Generales**:
  - Total de encuestas completadas
  - Tasa de abandono por paso
  - Tiempo promedio de completado
  - Top 5 barrios participantes

#### Panel de Comportamiento Web
- **Clarity + GA4**:
  - Heatmaps de interacción
  - Grabaciones de sesiones problemáticas
  - Embudo de conversión paso a paso
  - Dispositivos más utilizados

#### Panel de Resultados de Encuesta
- **Datos del Backend**:
  - Distribución de respuestas por pregunta
  - Prioridades de inversión por barrio
  - Análisis demográfico
  - Tendencias temporales

---

## 📋 5. Checklist de Implementación

### ✅ Configuración Básica
- [ ] Crear propiedad en Google Analytics 4
- [ ] Configurar proyecto en Microsoft Clarity
- [ ] Actualizar variables de entorno (.env.local)
- [ ] Verificar que los scripts se cargan correctamente

### ✅ Testing
- [ ] Probar eventos personalizados en modo desarrollador
- [ ] Verificar datos en GA4 Real-Time
- [ ] Confirmar grabaciones en Clarity
- [ ] Validar métricas por 24-48 horas

### ✅ Looker Studio
- [ ] Conectar GA4 como fuente de datos
- [ ] Configurar conexión con backend (BigQuery/Sheets)
- [ ] Crear dashboard principal
- [ ] Configurar alertas y automatizaciones

---

## 🚀 6. Comandos Útiles

### Desarrollo Local
```bash
# Verificar variables de entorno
npm run build
npm run preview

# Debug de analytics
# Abre Developer Tools → Console
# Verifica: window.gtag y window.trackSurveyEvent
```

### Producción
```bash
# Verificar en producción
# Chrome DevTools → Network → Filtrar por "analytics" y "clarity"
# Asegurar que los scripts se cargan correctamente
```

---

## 📞 Soporte

### Enlaces Útiles
- [GA4 Setup Guide](https://support.google.com/analytics/answer/9304153)
- [Clarity Documentation](https://docs.microsoft.com/en-us/clarity/)
- [Looker Studio Help](https://support.google.com/looker-studio/)

### Troubleshooting
- **GA4 no recibe datos**: Verificar ID y red (adblockers)
- **Clarity no graba**: Verificar dominio en configuración
- **Looker no actualiza**: Verificar permisos de API

---

*Última actualización: ${new Date().toLocaleDateString('es-AR')}*