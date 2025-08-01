import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 4321,
    host: true,
    allowedHosts: ['encuesta.ceres.gob.ar', 'localhost', '127.0.0.1', '66.97.47.243']
  },
  preview: {
    port: 4321,
    host: true,
    allowedHosts: ['encuesta.ceres.gob.ar', 'localhost', '127.0.0.1', '66.97.47.243']
  }
});