<template>
  <div class="edit-contact-container">
    <div class="header">
      <h1>Editar Contacto</h1>
      <router-link to="/agenda" class="btn btn-secondary">
        Volver a Agenda
      </router-link>
    </div>

    <div v-if="loading" class="loading">Cargando contacto...</div>
    
    <div v-else-if="!contact" class="error-state">
      <p>Contacto no encontrado</p>
      <router-link to="/agenda" class="btn btn-primary">Volver a Agenda</router-link>
    </div>

    <div v-else class="card">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="nombre">Nombre *</label>
          <input 
            type="text" 
            id="nombre" 
            v-model="form.nombre" 
            required 
            :class="{ 'input-error': errors.nombre }"
          >
          <span class="error-message" v-if="errors.nombre">{{ errors.nombre }}</span>
        </div>

        <div class="form-group">
          <label for="apellido">Apellido</label>
          <input 
            type="text" 
            id="apellido" 
            v-model="form.apellido" 
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
          >
          <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="direccion">Dirección</label>
          <input 
            type="text" 
            id="direccion" 
            v-model="form.direccion" 
          >
        </div>

        <div class="form-group">
          <label for="notas">Notas</label>
          <textarea 
            id="notas" 
            v-model="form.notas" 
            rows="4" 
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="updating">
            {{ updating ? 'Actualizando...' : 'Actualizar Contacto' }}
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const route = useRoute()

const contact = ref(null)
const loading = ref(true)
const updating = ref(false)
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

const loadContact = async () => {
  try {
    const response = await api.get('/contactos/')
    if (response.data.success) {
      const contactId = parseInt(route.params.id)
      const foundContact = response.data.data.find(c => c.id === contactId)
      
      if (foundContact) {
        contact.value = foundContact
        Object.assign(form, foundContact)
      }
    }
  } catch (error) {
    console.error('Error cargando contacto:', error)
  } finally {
    loading.value = false
  }
}

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
  
  updating.value = true
  message.value = ''
  
  try {
    const response = await api.put(`/contactos/actualizar.php?id=${contact.value.id}`, form)
    
    if (response.data.success) {
      message.value = '¡Contacto actualizado exitosamente!'
      messageType.value = 'success'
      
      setTimeout(() => {
        router.push('/agenda')
      }, 1500)
    } else {
      message.value = response.data.message || 'Error al actualizar contacto'
      messageType.value = 'error'
    }
  } catch (error) {
    message.value = error.response?.data?.message || 'Error de conexión'
    messageType.value = 'error'
  } finally {
    updating.value = false
  }
}

onMounted(() => {
  loadContact()
})
</script>

<style scoped>
.edit-contact-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}

.error-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.error-state p {
  margin-bottom: 1.5rem;
  color: #e74c3c;
  font-size: 1.1rem;
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