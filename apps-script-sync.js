// 🔄 GOOGLE APPS SCRIPT - SINCRONIZACIÓN AUTOMÁTICA
// Pega este código en Google Apps Script para sincronizar datos automáticamente

const CONFIG = {
  API_BASE_URL: 'https://api.ceres.gob.ar/api/api',
  ENDPOINTS: {
    todas: '/todas',
    estadisticas: '/estadisticas',
    salud: '/salud'
  },
  SHEETS: {
    raw: 'Respuestas_Raw',
    barrio: 'Estadisticas_Barrio', 
    obras: 'Obras_Ranking',
    servicios: 'Servicios_Ranking',
    temporal: 'Evolucion_Temporal',
    kpis: 'KPIs_Generales',
    config: 'Config'
  }
};

// 🚀 FUNCIÓN PRINCIPAL - Ejecutar sincronización completa
function sincronizarDatos() {
  try {
    console.log('🔄 Iniciando sincronización...');
    
    // Obtener datos de la API
    const datosEncuestas = obtenerDatosAPI('/todas');
    const estadisticas = obtenerDatosAPI('/estadisticas');
    const salud = obtenerDatosAPI('/salud');
    
    if (!datosEncuestas || !datosEncuestas.success) {
      throw new Error('No se pudieron obtener datos de la API');
    }
    
    const encuestas = datosEncuestas.data.encuestas;
    
    // Actualizar cada pestaña
    actualizarRespuestasRaw(encuestas);
    actualizarEstadisticasBarrio(encuestas);
    actualizarRankingObras(encuestas);
    actualizarRankingServicios(encuestas);
    actualizarEvolucionTemporal(encuestas);
    actualizarKPIsGenerales(encuestas, datosEncuestas.data);
    actualizarConfiguracion(salud);
    
    console.log('✅ Sincronización completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error en sincronización:', error);
    registrarError(error);
  }
}

// 🌐 FUNCIÓN - Obtener datos de la API
function obtenerDatosAPI(endpoint) {
  try {
    const url = CONFIG.API_BASE_URL + endpoint;
    console.log(`📡 Llamando a: ${url}`);
    
    const response = UrlFetchApp.fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'GoogleAppsScript-Dashboard'
      },
      muteHttpExceptions: true
    });
    
    if (response.getResponseCode() !== 200) {
      throw new Error(`API Error: ${response.getResponseCode()}`);
    }
    
    return JSON.parse(response.getContentText());
    
  } catch (error) {
    console.error(`Error obteniendo datos de ${endpoint}:`, error);
    return null;
  }
}

// 📝 FUNCIÓN - Actualizar datos raw
function actualizarRespuestasRaw(encuestas) {
  const sheet = obtenerHoja(CONFIG.SHEETS.raw);
  
  // Limpiar datos existentes (mantener headers)
  if (sheet.getLastRow() > 1) {
    sheet.deleteRows(2, sheet.getLastRow() - 1);
  }
  
  // Headers
  const headers = ['id', 'dni', 'barrio', 'obrasUrgentes', 'serviciosMejorar', 
                   'nombreCompleto', 'telefono', 'email', 'fechaCreacion', 'estado'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Datos
  const datos = encuestas.map(encuesta => [
    encuesta.id,
    encuesta.dni,
    encuesta.barrio,
    encuesta.obrasUrgentes.join(', '),
    encuesta.serviciosMejorar.join(', '),
    encuesta.nombreCompleto || '',
    encuesta.telefono || '',
    encuesta.email || '',
    new Date(encuesta.fechaCreacion),
    encuesta.estado
  ]);
  
  if (datos.length > 0) {
    sheet.getRange(2, 1, datos.length, headers.length).setValues(datos);
  }
}

// 📊 FUNCIÓN - Estadísticas por barrio
function actualizarEstadisticasBarrio(encuestas) {
  const sheet = obtenerHoja(CONFIG.SHEETS.barrio);
  
  // Agrupar por barrio
  const estadisticasPorBarrio = {};
  const totalEncuestas = encuestas.length;
  
  encuestas.forEach(encuesta => {
    const barrio = encuesta.barrio;
    if (!estadisticasPorBarrio[barrio]) {
      estadisticasPorBarrio[barrio] = {
        total: 0,
        obras: {},
        ultimaFecha: new Date(encuesta.fechaCreacion)
      };
    }
    
    estadisticasPorBarrio[barrio].total++;
    
    // Contar obras más solicitadas por barrio
    encuesta.obrasUrgentes.forEach(obra => {
      estadisticasPorBarrio[barrio].obras[obra] = 
        (estadisticasPorBarrio[barrio].obras[obra] || 0) + 1;
    });
    
    // Actualizar última fecha
    const fechaEncuesta = new Date(encuesta.fechaCreacion);
    if (fechaEncuesta > estadisticasPorBarrio[barrio].ultimaFecha) {
      estadisticasPorBarrio[barrio].ultimaFecha = fechaEncuesta;
    }
  });
  
  // Limpiar y escribir datos
  sheet.clear();
  const headers = ['Barrio', 'Total_Respuestas', 'Porcentaje', 'Ultima_Actualizacion', 'Obras_Mas_Solicitadas'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  const datos = Object.entries(estadisticasPorBarrio).map(([barrio, stats]) => {
    const obrasMasVotadas = Object.entries(stats.obras)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([obra]) => obra)
      .join(', ');
    
    return [
      barrio,
      stats.total,
      `${((stats.total / totalEncuestas) * 100).toFixed(1)}%`,
      stats.ultimaFecha,
      obrasMasVotadas
    ];
  });
  
  if (datos.length > 0) {
    sheet.getRange(2, 1, datos.length, headers.length).setValues(datos);
  }
}

// 🏗️ FUNCIÓN - Ranking de obras
function actualizarRankingObras(encuestas) {
  const sheet = obtenerHoja(CONFIG.SHEETS.obras);
  
  const conteoObras = {};
  const barriosPorObra = {};
  let totalVotos = 0;
  
  encuestas.forEach(encuesta => {
    encuesta.obrasUrgentes.forEach(obra => {
      conteoObras[obra] = (conteoObras[obra] || 0) + 1;
      
      if (!barriosPorObra[obra]) {
        barriosPorObra[obra] = new Set();
      }
      barriosPorObra[obra].add(encuesta.barrio);
      
      totalVotos++;
    });
  });
  
  // Limpiar y escribir
  sheet.clear();
  const headers = ['Obra', 'Cantidad_Votos', 'Porcentaje', 'Barrios_Solicitaron'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  const datos = Object.entries(conteoObras)
    .sort(([,a], [,b]) => b - a)
    .map(([obra, votos]) => [
      obra,
      votos,
      `${((votos / totalVotos) * 100).toFixed(1)}%`,
      Array.from(barriosPorObra[obra]).join(', ')
    ]);
  
  if (datos.length > 0) {
    sheet.getRange(2, 1, datos.length, headers.length).setValues(datos);
  }
}

// 🔧 FUNCIÓN - Ranking de servicios
function actualizarRankingServicios(encuestas) {
  const sheet = obtenerHoja(CONFIG.SHEETS.servicios);
  
  const conteoServicios = {};
  const barriosPorServicio = {};
  let totalVotos = 0;
  
  encuestas.forEach(encuesta => {
    encuesta.serviciosMejorar.forEach(servicio => {
      conteoServicios[servicio] = (conteoServicios[servicio] || 0) + 1;
      
      if (!barriosPorServicio[servicio]) {
        barriosPorServicio[servicio] = new Set();
      }
      barriosPorServicio[servicio].add(encuesta.barrio);
      
      totalVotos++;
    });
  });
  
  // Limpiar y escribir
  sheet.clear();
  const headers = ['Servicio', 'Cantidad_Votos', 'Porcentaje', 'Barrios_Solicitaron'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  const datos = Object.entries(conteoServicios)
    .sort(([,a], [,b]) => b - a)
    .map(([servicio, votos]) => [
      servicio,
      votos,
      `${((votos / totalVotos) * 100).toFixed(1)}%`,
      Array.from(barriosPorServicio[servicio]).join(', ')
    ]);
  
  if (datos.length > 0) {
    sheet.getRange(2, 1, datos.length, headers.length).setValues(datos);
  }
}

// 📅 FUNCIÓN - Evolución temporal
function actualizarEvolucionTemporal(encuestas) {
  const sheet = obtenerHoja(CONFIG.SHEETS.temporal);
  
  // Agrupar por fecha
  const porFecha = {};
  
  encuestas.forEach(encuesta => {
    const fecha = new Date(encuesta.fechaCreacion).toISOString().split('T')[0];
    porFecha[fecha] = (porFecha[fecha] || 0) + 1;
  });
  
  // Limpiar y escribir
  sheet.clear();
  const headers = ['Fecha', 'Respuestas_Dia', 'Acumulado', 'Porcentaje_Meta'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  let acumulado = 0;
  const metaTotal = 1000; // Ajustar según la meta municipal
  
  const datos = Object.entries(porFecha)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([fecha, respuestas]) => {
      acumulado += respuestas;
      return [
        new Date(fecha),
        respuestas,
        acumulado,
        `${((acumulado / metaTotal) * 100).toFixed(1)}%`
      ];
    });
  
  if (datos.length > 0) {
    sheet.getRange(2, 1, datos.length, headers.length).setValues(datos);
  }
}

// 📊 FUNCIÓN - KPIs generales
function actualizarKPIsGenerales(encuestas, datosCompletos) {
  const sheet = obtenerHoja(CONFIG.SHEETS.kpis);
  
  const completadas = encuestas.filter(e => e.estado === 'completada').length;
  const conContacto = encuestas.filter(e => e.quiereContacto).length;
  const barriosUnicos = new Set(encuestas.map(e => e.barrio)).size;
  
  // Calcular promedio por día
  const fechas = encuestas.map(e => new Date(e.fechaCreacion).toISOString().split('T')[0]);
  const diasUnicos = new Set(fechas).size;
  const promedioPorDia = diasUnicos > 0 ? (encuestas.length / diasUnicos).toFixed(1) : 0;
  
  const kpis = [
    ['Total Respuestas', encuestas.length],
    ['Encuestas Completadas', completadas],
    ['Tasa Completado', `${completadas > 0 ? ((completadas / encuestas.length) * 100).toFixed(1) : 0}%`],
    ['Barrios Participantes', barriosUnicos],
    ['Promedio Respuestas/Día', promedioPorDia],
    ['Última Actualización', new Date()],
    ['Personas Quieren Contacto', conContacto],
    ['Tasa Engagement', `${encuestas.length > 0 ? ((conContacto / encuestas.length) * 100).toFixed(1) : 0}%`],
    ['Total Páginas', datosCompletos.totalPages || 1],
    ['Página Actual', datosCompletos.page || 1]
  ];
  
  sheet.clear();
  sheet.getRange(1, 1, 1, 2).setValues([['Métrica', 'Valor']]);
  sheet.getRange(2, 1, kpis.length, 2).setValues(kpis);
}

// ⚙️ FUNCIÓN - Actualizar configuración
function actualizarConfiguracion(saludAPI) {
  const sheet = obtenerHoja(CONFIG.SHEETS.config);
  
  const config = [
    ['API_URL', CONFIG.API_BASE_URL],
    ['Última_Sync', new Date()],
    ['Estado_API', saludAPI ? 'ACTIVO' : 'ERROR'],
    ['Próxima_Sync', new Date(Date.now() + 30 * 60000)], // +30 minutos
    ['Total_Errores', 0] // Implementar contador de errores
  ];
  
  sheet.clear();
  sheet.getRange(1, 1, 1, 2).setValues([['Parámetro', 'Valor']]);
  sheet.getRange(2, 1, config.length, 2).setValues(config);
}

// 🔧 FUNCIÓN AUXILIAR - Obtener o crear hoja
function obtenerHoja(nombre) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(nombre);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(nombre);
    console.log(`✅ Hoja creada: ${nombre}`);
  }
  
  return sheet;
}

// 📝 FUNCIÓN - Registrar errores
function registrarError(error) {
  const sheet = obtenerHoja('Errores');
  const timestamp = new Date();
  const errorData = [timestamp, error.toString(), error.stack || 'No stack trace'];
  
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 3).setValues([['Timestamp', 'Error', 'Stack']]);
  }
  
  sheet.getRange(sheet.getLastRow() + 1, 1, 1, 3).setValues([errorData]);
}

// ⏰ FUNCIÓN - Configurar trigger automático
function configurarTriggerAutomatico() {
  // Eliminar triggers existentes
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'sincronizarDatos') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Crear nuevo trigger cada 30 minutos
  ScriptApp.newTrigger('sincronizarDatos')
    .timeBased()
    .everyMinutes(30)
    .create();
  
  console.log('✅ Trigger automático configurado (cada 30 minutos)');
}

// 🧪 FUNCIÓN - Test manual
function testSincronizacion() {
  console.log('🧪 Ejecutando test de sincronización...');
  sincronizarDatos();
}

// 🧪 FUNCIÓN - Test de conexión API
function testConexionAPI() {
  console.log('🧪 TESTING CONEXIÓN CON API CERES...\n');
  
  const endpoints = ['/todas', '/estadisticas', '/salud'];
  const baseUrl = 'https://api.ceres.gob.ar/api/api';
  
  endpoints.forEach(endpoint => {
    try {
      console.log(`📡 Probando: ${baseUrl}${endpoint}`);
      
      const response = UrlFetchApp.fetch(baseUrl + endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        muteHttpExceptions: true
      });
      
      const responseCode = response.getResponseCode();
      const content = response.getContentText();
      
      if (responseCode === 200) {
        const data = JSON.parse(content);
        console.log(`✅ ${endpoint}: OK`);
        console.log(`   Datos: ${JSON.stringify(data).substring(0, 100)}...`);
        
        if (endpoint === '/todas' && data.success) {
          console.log(`   📊 Total encuestas: ${data.data.encuestas.length}`);
          console.log(`   📄 Páginas: ${data.data.totalPages}`);
        }
      } else {
        console.log(`❌ ${endpoint}: Error ${responseCode}`);
        console.log(`   Respuesta: ${content.substring(0, 200)}`);
      }
      
    } catch (error) {
      console.log(`💥 ${endpoint}: Error - ${error.toString()}`);
    }
    
    console.log(''); // Línea en blanco
  });
  
  console.log('🏁 Test completado');
}