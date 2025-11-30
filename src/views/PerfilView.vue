<template>
  <div class="profile-container">
    <div class="header">
      <h1>Mi Perfil</h1>
      <div class="header-actions">
        <router-link to="/agenda" class="btn btn-secondary">
          Volver a Agenda
        </router-link>
        <button @click="authStore.logout()" class="btn btn-delete">
          Cerrar Sesión
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">Cargando información del perfil...</div>
    
    <div v-else class="profile-content">
      <div class="card">
        <h3>Información del Perfil</h3>
        <div class="profile-info">
          <div class="info-item">
            <label>Usuario:</label>
            <span>{{ userData.nombre_de_usuario }}</span>
          </div>
          
          <div class="info-item">
            <label>ID de Usuario:</label>
            <span>{{ userData.id }}</span>
          </div>
          
          <div class="info-item">
            <label>Fecha de Registro:</label>
            <span>{{ formatDate(userData.fecha_registro) }}</span>
          </div>
          
          <div class="info-item">
            <label>Estado:</label>
            <span class="status active">Activo</span>
          </div>
        </div>
      </div>

      <!-- Sección de Edición -->
      <div class="card">
        <h3>Editar Perfil</h3>
        <form @submit.prevent="handleUpdateProfile">
          <div class="form-group">
            <label for="nuevoUsuario">Nuevo Usuario:</label>
            <input 
              type="text" 
              id="nuevoUsuario" 
              v-model="editForm.nombre_de_usuario" 
              placeholder="Dejar vacío para no cambiar"
            >
          </div>

          <div class="form-group">
            <label for="nuevaPassword">Nueva Contraseña:</label>
            <input 
              type="password" 
              id="nuevaPassword" 
              v-model="editForm.password" 
              placeholder="Dejar vacío para no cambiar"
            >
          </div>

          <div class="form-group">
            <label for="confirmarPassword">Confirmar Contraseña:</label>
            <input 
              type="password" 
              id="confirmarPassword" 
              v-model="editForm.confirmPassword" 
              placeholder="Confirmar nueva contraseña"
              :class="{ 'input-error': errors.confirmPassword }"
            >
            <span class="error-message" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</span>
          </div>

          <button type="submit" class="btn btn-primary" :disabled="updating">
            {{ updating ? 'Actualizando...' : 'Actualizar Perfil' }}
          </button>
        </form>

        <div v-if="message" :class="['message', messageType]">
          {{ message }}
        </div>
      </div>

      <div class="stats-card card">
        <h3>Estadísticas</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">{{ stats.totalContacts }}</div>
            <div class="stat-label">Contactos Totales</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.contactsWithEmail }}</div>
            <div class="stat-label">Con Email</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.contactsWithAddress }}</div>
            <div class="stat-label">Con Dirección</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'

const authStore = useAuthStore()

const userData = ref({})
const stats = ref({
  totalContacts: 0,
  contactsWithEmail: 0,
  contactsWithAddress: 0
})
const loading = ref(true)
const updating = ref(false)
const message = ref('')
const messageType = ref('')

const editForm = reactive({
  nombre_de_usuario: '',
  password: '',
  confirmPassword: ''
})

const errors = reactive({
  confirmPassword: ''
})

const loadProfileData = async () => {
  try {
    const userResponse = await api.get('/usuario/perfil.php')
    if (userResponse.data.success) {
      userData.value = userResponse.data.data
    }

    const contactsResponse = await api.get('/contactos/')
    if (contactsResponse.data.success) {
      const contacts = contactsResponse.data.data
      stats.value.totalContacts = contacts.length
      stats.value.contactsWithEmail = contacts.filter(c => c.email).length
      stats.value.contactsWithAddress = contacts.filter(c => c.direccion).length
    }
  } catch (error) {
    console.error('Error cargando datos del perfil:', error)
  } finally {
    loading.value = false
  }
}

const validateForm = () => {
  let isValid = true
  
  errors.confirmPassword = ''
  
  if (editForm.password && editForm.password !== editForm.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden'
    isValid = false
  }
  
  return isValid
}

const handleUpdateProfile = async () => {
  if (!validateForm()) return
  
  updating.value = true
  message.value = ''
  
  try {
    // Preparar datos para enviar (solo los campos que tienen valor)
    const updateData = {}
    
    if (editForm.nombre_de_usuario.trim()) {
      updateData.nombre_de_usuario = editForm.nombre_de_usuario
    }
    
    if (editForm.password) {
      updateData.password = editForm.password
    }
    
    // Si no hay datos para actualizar
    if (Object.keys(updateData).length === 0) {
      message.value = 'No hay cambios para actualizar'
      messageType.value = 'info'
      updating.value = false
      return
    }
    
    const response = await api.put('/usuario/editar.php', updateData)
    
    if (response.data.success) {
      message.value = '¡Perfil actualizado exitosamente!'
      messageType.value = 'success'
      
      // Limpiar formulario
      editForm.nombre_de_usuario = ''
      editForm.password = ''
      editForm.confirmPassword = ''
      
      // Recargar datos del perfil
      await loadProfileData()
    } else {
      message.value = response.data.message || 'Error al actualizar perfil'
      messageType.value = 'error'
    }
  } catch (error) {
    message.value = error.response?.data?.message || 'Error de conexión'
    messageType.value = 'error'
  } finally {
    updating.value = false
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadProfileData()
})
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.profile-content {
  display: grid;
  gap: 2rem;
}

.stats-card h3 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
  text-align: center;
}
</style>