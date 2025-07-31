# 🚀 Guía de Despliegue - VPS Ubuntu con PM2

## 📋 Prerrequisitos

- VPS Ubuntu 20.04 o superior
- Node.js 18+ instalado
- PM2 instalado globalmente
- Acceso SSH al servidor

## 🔧 Instalación de Dependencias en el VPS

### 1. Instalar Node.js (si no está instalado)
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalación
node --version
npm --version
```

### 2. Instalar PM2
```bash
sudo npm install -g pm2
```

### 3. Instalar dependencias del sistema
```bash
sudo apt install -y git curl wget
```

## 📁 Preparar el Proyecto

### 1. Clonar o subir el proyecto
```bash
# Opción A: Clonar desde Git
git clone https://github.com/tu-usuario/encuesta-obras.git
cd encuesta-obras

# Opción B: Subir archivos via SCP/SFTP
# Sube todos los archivos del proyecto a tu VPS
```

### 2. Configurar variables de entorno
```bash
# Crear archivo de variables de producción
cp env.production.example .env.production

# Editar con tu URL del backend
nano .env.production
```

**Contenido de `.env.production`:**
```env
PUBLIC_API_URL=http://IP_BACKEND:3001/api
```

## 🚀 Despliegue Automático

### Opción 1: Script Automático (Recomendado)
```bash
# Hacer ejecutable el script
chmod +x deploy.sh

# Ejecutar despliegue
./deploy.sh
```

### Opción 2: Despliegue Manual
```bash
# 1. Instalar dependencias
npm install

# 2. Build de producción
npm run build:prod

# 3. Crear directorio de logs
mkdir -p logs

# 4. Iniciar con PM2
pm2 start ecosystem.config.js --env production

# 5. Guardar configuración
pm2 save

# 6. Configurar inicio automático
pm2 startup
```

## 🔥 Configurar Firewall

### Permitir puerto 4321
```bash
# UFW (Ubuntu)
sudo ufw allow 4321

# O iptables
sudo iptables -A INPUT -p tcp --dport 4321 -j ACCEPT
sudo iptables-save
```

## 📊 Comandos de Gestión

### Ver estado de la aplicación
```bash
pm2 status
```

### Ver logs en tiempo real
```bash
pm2 logs encuesta-obras
```

### Ver logs específicos
```bash
pm2 logs encuesta-obras --lines 50
```

### Reiniciar aplicación
```bash
pm2 restart encuesta-obras
```

### Detener aplicación
```bash
pm2 stop encuesta-obras
```

### Eliminar aplicación
```bash
pm2 delete encuesta-obras
```

### Actualizar aplicación
```bash
# Detener
pm2 stop encuesta-obras

# Hacer cambios en el código

# Rebuild y reiniciar
npm run build:prod
pm2 restart encuesta-obras
```

## 🌐 Acceso a la Aplicación

Una vez desplegada, podrás acceder a tu aplicación en:

```
http://IP_VPS:4321
```

### Ejemplo:
```
http://192.168.1.100:4321
http://203.0.113.45:4321
```

## 🔍 Troubleshooting

### Problema: Puerto no accesible
```bash
# Verificar si el puerto está abierto
sudo netstat -tlnp | grep 4321

# Verificar firewall
sudo ufw status
```

### Problema: PM2 no inicia
```bash
# Ver logs de PM2
pm2 logs

# Verificar configuración
pm2 show encuesta-obras
```

### Problema: Build falla
```bash
# Limpiar cache
npm run clean
rm -rf node_modules
npm install
npm run build:prod
```

### Problema: Memoria insuficiente
```bash
# Ver uso de memoria
pm2 monit

# Ajustar límite en ecosystem.config.js
max_memory_restart: '512M'
```

## 📈 Monitoreo

### Instalar PM2 Plus (opcional)
```bash
pm2 install pm2-server-monit
```

### Ver métricas
```bash
pm2 monit
```

## 🔄 Actualizaciones

Para actualizar la aplicación:

1. **Subir nuevos archivos** al VPS
2. **Ejecutar el script de despliegue**:
   ```bash
   ./deploy.sh
   ```

O manualmente:
```bash
npm install
npm run build:prod
pm2 restart encuesta-obras
```

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs: `pm2 logs encuesta-obras`
2. Verifica el estado: `pm2 status`
3. Revisa la configuración: `pm2 show encuesta-obras`
4. Reinicia la aplicación: `pm2 restart encuesta-obras` 