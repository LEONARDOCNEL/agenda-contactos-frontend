<template>
  <div class="create-contact-container">
    <div class="header">
      <h1>Crear Nuevo Contacto</h1>
      <router-link to="/agenda" class="btn btn-secondary">
        Volver a Agenda
      </router-link>
    </div>

    <div class="card">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="nombre">Nombre *</label>
          <input 
            type="text" 
            id="nombre" 
            v-model="form.nombre" 
            required 
            :class="{ 'input-error': errors.nombre }"
            placeholder="Ej: Juan"
          >
          <span class="error-message" v-if="errors.nombre">{{ errors.nombre }}</span>
        </div>

        <div class="form-group">
          <label for="apellido">Apellido</label>
          <input 
            type="text" 
            id="apellido" 
            v-model="form.apellido" 
            placeholder="Ej: Pérez"
          >
        </div>

        <div class="form-group">
          <label for="telefono">Teléfono *</label>
          <input 
            type="tel" 
            id="telefono" 
            v-model="form.telefono" 
            required 
            :class="{ 'input-error': errors.telefono }"
            placeholder="Ej: +34 612 345 678"
          >
          <span class="error-message" v-if="errors.telefono">{{ errors.telefono }}</span>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email" 
            :class="{ 'input-error': errors.email }"
            placeholder="Ej: juan@email.com"
          >
          <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="direccion">Dirección</label>
          <input 
            type="text" 
            id="direccion" 
            v-model="form.direccion" 
            placeholder="Ej: Calle Principal 123, Ciudad"
          >
        </div>

        <div class="form-group">
          <label for="notas">Notas</label>
          <textarea 
            id="notas" 
            v-model="form.notas" 
            rows="4" 
            placeholder="Notas adicionales sobre el contacto..."
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Creando...' : 'Crear Contacto' }}
          </button>
          <router-link to="/agenda" class="btn btn-secondary">
            Cancelar
          </router-link>
        </div>
      </form>

      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()

const loading = ref(false)
const message = ref('')
const messageType = ref('')

const form = reactive({
  nombre: '',
  apellido: '',
  telefono: '',
  email: '',
  direccion: '',
  notas: ''
})

const errors = reactive({
  nombre: '',
  telefono: '',
  email: ''
})

const validateForm = () => {
  let isValid = true
  
  errors.nombre = ''
  errors.telefono = ''
  errors.email = ''
  
  if (!form.nombre.trim()) {
    errors.nombre = 'El nombre es obligatorio'
    isValid = false
  }
  
  if (!form.telefono.trim()) {
    errors.telefono = 'El teléfono es obligatorio'
    isValid = false
  }
  
  if (form.email && !isValidEmail(form.email)) {
    errors.email = 'El email no tiene un formato válido'
    isValid = false
  }
  
  return isValid
}

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  loading.value = true
  message.value = ''
  
  try {
    const response = await api.post('/contactos/crear.php', form)
    
    if (response.data.success) {
      message.value = '¡Contacto creado exitosamente!'
      messageType.value = 'success'
      
      setTimeout(() => {
        router.push('/agenda')
      }, 1500)
    } else {
      message.value = response.data.message || 'Error al crear contacto'
      messageType.value = 'error'
    }
  } catch (error) {
    message.value = error.response?.data?.message || 'Error de conexión'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.create-contact-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.form-actions .btn {
  flex: 1;
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }
}
</style>