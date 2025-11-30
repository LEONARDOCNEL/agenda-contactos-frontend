<template>
  <div class="inicio-container">
    <div class="hero-section">
      <div class="hero-content">
        <h1>Bienvenido a tu Agenda Personal</h1>
        <p>Gestiona tus contactos de forma segura y organizada</p>
        <div class="hero-actions">
          <router-link v-if="!authStore.isAuthenticated" to="/login" class="btn btn-primary">
            Iniciar Sesión
          </router-link>
          <router-link v-if="!authStore.isAuthenticated" to="/registro" class="btn btn-secondary">
            Registrarse
          </router-link>
          <router-link v-if="authStore.isAuthenticated" to="/agenda" class="btn btn-success">
            Ver Mi Agenda
          </router-link>
        </div>
      </div>
    </div>

    <div class="features-section">
      <div class="container">
        <h2>Características Principales</h2>
        <div class="features-grid">
          <div class="feature-card">
            <h3>🔐 Autenticación Segura</h3>
            <p>Sistema de login con tokens JWT para máxima seguridad</p>
          </div>
          <div class="feature-card">
            <h3>📱 Gestión Completa</h3>
            <p>Crear, editar, eliminar y buscar contactos fácilmente</p>
          </div>
          <div class="feature-card">
            <h3>🌐 Tecnología Moderna</h3>
            <p>Desarrollado con Vue 3, PHP y MySQL</p>
          </div>
          <div class="feature-card">
            <h3>📱 Responsive</h3>
            <p>Funciona perfectamente en desktop y móvil</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
</script>