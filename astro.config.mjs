// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // Configuración de salida estática para mejor rendimiento
  output: 'static',
  
  // Configuración de build
  build: {
    // Generar sitemap automáticamente
    inlineStylesheets: 'auto',
  },

  vite: {
    plugins: [tailwindcss()],
    
    // Optimizaciones para producción
    build: {
      // Minificar CSS y JS
      minify: 'terser',
      
      // Dividir chunks para mejor caching
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'astro-vendor': ['astro']
          }
        }
      }
    },
    
    // Optimizaciones de CSS
    css: {
      devSourcemap: false
    },
    
    // Configuración de servidor para permitir hosts externos
    server: {
      port: 4321,
      host: true,
      allowedHosts: ['encuesta.ceres.gob.ar', 'localhost', '127.0.0.1', '66.97.47.243']
    },
    
    // Configuración de preview para permitir hosts externos
    preview: {
      port: 4321,
      host: true,
      allowedHosts: ['encuesta.ceres.gob.ar', 'localhost', '127.0.0.1', '66.97.47.243']
    }
  },

  integrations: [react()],
  
  // Configuración de servidor para preview
  server: {
    port: 4321,
    host: true
  }
});