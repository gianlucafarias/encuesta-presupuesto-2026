# Encuesta de Presupuesto 2026

Frontend para la encuesta de presupuesto participativo municipal 2026. Desarrollado con **Astro** para máxima eficiencia y rendimiento.

## 🚀 Características

- **Validación única por DNI**: Cada ciudadano puede completar la encuesta solo una vez
- **Formulario multi-paso**: Experiencia de usuario fluida y organizada
- **Diseño responsivo**: Optimizado para móviles, tablets y desktop
- **Validación en tiempo real**: Feedback inmediato al usuario
- **Alta performance**: Generación estática con Astro
- **SEO optimizado**: Meta tags y estructura semántica
- **Accesibilidad**: Cumple con estándares WCAG

## 📋 Pasos de la Encuesta

1. **Validación de DNI**: Verificación de identidad y unicidad
2. **Datos Personales**: Información básica del ciudadano
3. **Prioridades de Inversión**: Asignación de porcentajes por área
4. **Comentarios y Sugerencias**: Feedback cualitativo
5. **Confirmación**: Revisión final antes del envío

## 🛠️ Tecnologías

- **Astro 4.x**: Framework estático moderno
- **React 18**: Para componentes interactivos
- **TypeScript**: Type safety completo
- **Tailwind CSS**: Estilos utilitarios
- **HTML5**: Semántica moderna

## 📦 Instalación

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Pasos

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd encuesta-obras
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env`:
```env
PUBLIC_API_URL=http://localhost:3001/api
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:4321`

## 🔧 Configuración

### Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `PUBLIC_API_URL` | URL del backend API | `http://localhost:3001/api` |

### Configuración del Backend

El frontend espera que tu backend tenga estos endpoints:

#### POST `/api/validate-dni`
```json
{
  "dni": "12345678"
}
```

Respuesta:
```json
{
  "success": true,
  "data": {
    "exists": false,
    "valid": true
  }
}
```

#### POST `/api/submit-survey`
```json
{
  "dni": "12345678",
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@email.com",
  "telefono": "011-1234-5678",
  "barrio": "centro",
  "prioridades": {
    "infraestructura": 30,
    "salud": 25,
    "educacion": 20,
    "seguridad": 15,
    "transporte": 10,
    "medioAmbiente": 0,
    "cultura": 0,
    "deportes": 0
  },
  "comentarios": "Comentarios del ciudadano...",
  "sugerencias": "Sugerencias específicas..."
}
```

Respuesta:
```json
{
  "success": true,
  "data": {
    "id": "survey_123",
    "submittedAt": "2026-01-15T10:30:00Z"
  }
}
```

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── SurveyForm.tsx   # Componente principal
│   ├── ProgressBar.tsx  # Barra de progreso
│   ├── DNIValidator.tsx # Validación de DNI
│   ├── PersonalData.tsx # Datos personales
│   ├── InvestmentPriorities.tsx # Prioridades
│   ├── Comments.tsx     # Comentarios
│   └── Confirmation.tsx # Confirmación
├── pages/               # Páginas Astro
│   └── index.astro      # Página principal
├── types/               # Tipos TypeScript
│   └── survey.ts        # Tipos de la encuesta
└── utils/               # Utilidades
    └── api.ts           # Funciones de API
```

## 🚀 Despliegue

### VPS Ubuntu

1. **Instalar Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Instalar PM2**
```bash
npm install -g pm2
```

3. **Configurar Nginx**
```bash
sudo apt install nginx
```

Configurar `/etc/nginx/sites-available/encuesta`:
```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    
    location / {
        proxy_pass http://localhost:4321;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. **Habilitar sitio**
```bash
sudo ln -s /etc/nginx/sites-available/encuesta /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

5. **Desplegar con PM2**
```bash
npm run build
pm2 start npm --name "encuesta" -- start
pm2 startup
pm2 save
```

### Docker (Opcional)

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 4321
CMD ["npm", "start"]
```

## 📊 Monitoreo y Performance

### Métricas Recomendadas

- **Tiempo de carga**: < 2 segundos
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Uptime**: > 99.9%
- **Concurrent users**: 1000+ simultáneos

### Herramientas de Monitoreo

- **PM2**: Monitoreo de procesos
- **Nginx**: Logs de acceso
- **Google Analytics**: Métricas de usuarios
- **Lighthouse**: Performance audit

## 🔒 Seguridad

### Implementado

- ✅ Validación de entrada en frontend
- ✅ Sanitización de datos
- ✅ Rate limiting (backend)
- ✅ HTTPS obligatorio
- ✅ Headers de seguridad

### Recomendaciones Adicionales

- Implementar CAPTCHA para prevenir bots
- Validación de DNI con RENAPER (backend)
- Logs de auditoría
- Backup automático de datos

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests de integración
npm run test:integration

# Tests E2E
npm run test:e2e
```

## 📈 Escalabilidad

### Estrategias

1. **CDN**: Cloudflare para assets estáticos
2. **Load Balancer**: Distribuir carga entre múltiples instancias
3. **Caching**: Redis para datos frecuentes
4. **Database**: PostgreSQL con pooling
5. **Queue**: RabbitMQ para picos de tráfico

### Configuración para Alto Tráfico

```bash
# Nginx worker processes
worker_processes auto;
worker_connections 1024;

# PM2 cluster mode
pm2 start npm --name "encuesta" -i max -- start
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

- **Email**: presupuesto@municipalidad.gob.ar
- **Teléfono**: 0800-123-4567
- **Documentación**: [Wiki del proyecto]

---

Desarrollado con ❤️ para la participación ciudadana
