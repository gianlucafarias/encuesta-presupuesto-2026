# 📊 CONFIGURACIÓN LOOKER STUDIO - DASHBOARD COMPLETO

## 🚀 PASO A PASO COMPLETO

### **1️⃣ CONFIGURAR GOOGLE SHEETS**

1. **Crear Spreadsheet**: [Google Sheets](https://sheets.google.com/)
   - Nombre: "Dashboard Encuesta Obras 2026"
   - Crear las 7 pestañas según `google-sheets-structure.md`

2. **Configurar Apps Script**:
   - En Google Sheets: `Extensiones` → `Apps Script`
   - Pegar código de `apps-script-sync.js`
   - Guardar y autorizar permisos
   - **Ejecutar una vez**: `testSincronizacion()`
   - **Configurar automático**: `configurarTriggerAutomatico()`

3. **Verificar datos**:
   - Debería ver datos de tu API en las pestañas
   - Si no funciona, revisar logs en Apps Script

---

### **2️⃣ CONECTAR GOOGLE ANALYTICS**

1. **Ir a Looker Studio**: [datastudio.google.com](https://datastudio.google.com/)

2. **Crear nuevo informe**:
   - Click en "Crear" → "Informe"
   - Buscar "Google Analytics" en conectores
   - Autorizar tu cuenta Google

3. **Seleccionar propiedad GA4**:
   - Buscar: "Plan de Obras 2026 - Ceres"
   - ID: `G-83P66QQV7Z`
   - Click "Agregar"

---

### **3️⃣ CONECTAR GOOGLE SHEETS**

1. **En el mismo informe de Looker**:
   - Click en "Agregar datos"
   - Buscar "Google Sheets"
   - Seleccionar tu spreadsheet "Dashboard Encuesta Obras 2026"

2. **Conectar cada pestaña**:
   - `Respuestas_Raw` → Para datos detallados
   - `Estadisticas_Barrio` → Para análisis geográfico
   - `Obras_Ranking` → Para ranking de prioridades
   - `Servicios_Ranking` → Para servicios más demandados
   - `KPIs_Generales` → Para métricas principales

---

### **4️⃣ DISEÑAR DASHBOARD**

## 📋 **LAYOUT PROPUESTO**

### **SECCIÓN 1: KPIs PRINCIPALES (Arriba)**
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ USUARIOS    │ RESPUESTAS  │ TASA        │ ÚLTIMA      │
│ ÚNICOS GA4  │ COMPLETADAS │ CONVERSIÓN  │ RESPUESTA   │
│    1,247    │     892     │   72.1%     │  Hace 2h    │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

**Configuración**:
- **Usuarios Únicos**: GA4 → Active users (Last 30 days)
- **Respuestas Completadas**: KPIs_Generales → Total Respuestas
- **Tasa Conversión**: GA4 Conversions / GA4 Users
- **Última Respuesta**: KPIs_Generales → Última Actualización

### **SECCIÓN 2: ANÁLISIS WEB (GA4)**
```
┌─────────────────────┬─────────────────────┐
│   USUARIOS POR DÍA  │   EVENTOS MÁS       │
│   (Gráfico lineal)  │   COMUNES           │
│                     │   (Tabla)           │
├─────────────────────┼─────────────────────┤
│   DISPOSITIVOS      │   EMBUDO DE         │
│   (Gráfico dona)    │   CONVERSIÓN        │
│                     │   (Gráfico barras)  │
└─────────────────────┴─────────────────────┘
```

**Configuración GA4**:
- **Usuarios por día**: Dimensión: Date, Métrica: Active users
- **Eventos más comunes**: Dimensión: Event name, Métrica: Event count
- **Dispositivos**: Dimensión: Device category, Métrica: Users
- **Embudo**: Eventos dni_validation_success → analytics_component_loaded

### **SECCIÓN 3: ANÁLISIS ENCUESTA (Backend)**
```
┌──────────────────┬──────────────────┬──────────────────┐
│  RESPUESTAS      │   TOP 5 OBRAS    │   TOP 5          │
│  POR BARRIO      │   URGENTES       │   SERVICIOS      │
│  (Mapa/Barras)   │   (Ranking)      │   (Ranking)      │
├──────────────────┼──────────────────┼──────────────────┤
│  EVOLUCIÓN       │   ENGAGEMENT     │   DISTRIBUCIÓN   │
│  TEMPORAL        │   CIUDADANO      │   GEOGRÁFICA     │
│  (Línea)         │   (Gauge)        │   (Tabla)        │
└──────────────────┴──────────────────┴──────────────────┘
```

**Configuración Backend**:
- **Por Barrio**: Estadisticas_Barrio → Barrio, Total_Respuestas
- **Top Obras**: Obras_Ranking → Obra, Cantidad_Votos
- **Top Servicios**: Servicios_Ranking → Servicio, Cantidad_Votos
- **Evolución**: Evolucion_Temporal → Fecha, Respuestas_Dia
- **Engagement**: KPIs_Generales → Tasa Engagement
- **Geográfica**: Estadisticas_Barrio → Completa

---

### **5️⃣ CONFIGURACIÓN AVANZADA**

#### **🎨 PERSONALIZACIÓN VISUAL**

1. **Colores Municipales**:
   - Verde principal: `#006F4B`
   - Verde secundario: `#008F5B`
   - Gris: `#6B7280`
   - Blanco: `#FFFFFF`

2. **Filtros de Control**:
   - **Selector de Fecha**: Para análisis temporal
   - **Selector de Barrio**: Para análisis específico
   - **Tipo de Obra**: Para filtrar por categoría

3. **Métricas Calculadas**:
```
Tasa de Conversión = (Respuestas Completadas / Usuarios Únicos) * 100
Promedio Diario = Total Respuestas / Días Transcurridos
Índice Participación = (Barrios con Respuestas / Total Barrios) * 100
```

#### **⚡ ACTUALIZACIONES AUTOMÁTICAS**

1. **Google Analytics**: Se actualiza automáticamente (15-30 min delay)
2. **Datos Backend**: Se actualizan cada 30 minutos via Apps Script
3. **Dashboard**: Refresco automático cada 15 minutos

#### **📱 VERSIÓN MÓVIL**

1. **Configurar vista móvil**:
   - KPIs principales arriba
   - Gráficos simplificados
   - Tablas con scroll horizontal

---

### **6️⃣ VERIFICACIÓN Y TESTING**

#### **✅ CHECKLIST DE VERIFICACIÓN**

- [ ] GA4 conectado y mostrando datos
- [ ] Google Sheets sincronizando con API cada 30 min
- [ ] Todas las fuentes de datos conectadas
- [ ] KPIs calculando correctamente
- [ ] Gráficos mostrando datos actuales
- [ ] Filtros funcionando
- [ ] Dashboard responsivo
- [ ] Colores municipales aplicados

#### **🧪 DATOS DE PRUEBA**

**Métricas que deberías ver**:
- **Total Respuestas**: 3 (según tu API)
- **Barrios**: Quilmes, Belgrano, Re
- **Top Obra**: Todas empate con 1 voto
- **Engagement**: 66.7% (2 de 3 quieren contacto)

---

### **7️⃣ COMPARTIR DASHBOARD**

1. **Configurar permisos**:
   - Editor: Administradores municipales
   - Visualizador: Personal interesado
   - Público: Si es transparencia ciudadana

2. **URL de acceso directo**
3. **Exportar PDF automático**
4. **Alertas por email**

---

## 🎯 **RESULTADO FINAL**

**Dashboard completo que muestra**:
- ✅ **Métricas web**: Usuarios, sesiones, eventos (GA4)
- ✅ **Resultados encuesta**: Respuestas, rankings, barrios (Backend)
- ✅ **Análisis temporal**: Evolución diaria/semanal
- ✅ **Insights geográficos**: Participación por barrio
- ✅ **KPIs gubernamentales**: Engagement, completado, metas
- ✅ **Actualización automática**: Datos frescos cada 30 min

**Perfecto para**:
- 🏛️ **Funcionarios**: Tomar decisiones basadas en datos
- 📊 **Análisis**: Identificar tendencias y patrones
- 🎯 **Optimización**: Mejorar participación ciudadana
- 📈 **Reportes**: Informes automáticos para autoridades