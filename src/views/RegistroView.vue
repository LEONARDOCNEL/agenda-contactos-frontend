<template>
  <div class="register-container">
    <div class="card" style="max-width: 400px;">
      <h2>Crear Cuenta</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="username">Usuario:</label>
          <input 
            type="text" 
            id="username" 
            v-model="form.username" 
            required 
            :class="{ 'input-error': errors.username }"
          >
          <span class="error-message" v-if="errors.username">{{ errors.username }}</span>
        </div>
        
        <div class="form-group">
          <label for="password">Contraseña:</label>
          <input 
            type="password" 
            id="password" 
            v-model="form.password" 
            required 
            :class="{ 'input-error': errors.password }"
          >
          <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">Confirmar Contraseña:</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="form.confirmPassword" 
            required 
            :class="{ 'input-error': errors.confirmPassword }"
          >
          <span class="error-message" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</span>
        </div>
        
        <button type="submit" class="btn btn-primary" :disabled="loading" style="width: 100%;">
          {{ loading ? 'Registrando...' : 'Registrarse' }}
        </button>
        
        <p class="login-link">
          ¿Ya tienes cuenta? <router-link to="/login">Inicia sesión aquí</router-link>
        </p>
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
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const message = ref('')
const messageType = ref('')

const form = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

const errors = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

const validateForm = () => {
  let isValid = true
  
  errors.username = ''
  errors.password = ''
  errors.confirmPassword = ''
  
  if (!form.username.trim()) {
    errors.username = 'El usuario es obligatorio'
    isValid = false
  } else if (form.username.length < 3) {
    errors.username = 'El usuario debe tener al menos 3 caracteres'
    isValid = false
  }
  
  if (!form.password) {
    errors.password = 'La contraseña es obligatoria'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres'
    isValid = false
  }
  
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Confirma tu contraseña'
    isValid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden'
    isValid = false
  }
  
  return isValid
}

const handleRegister = async () => {
  if (!validateForm()) return
  
  loading.value = true
  message.value = ''
  
  const result = await authStore.register(form.username, form.password)
  
  if (result.success) {
    message.value = '¡Cuenta creada exitosamente! Redirigiendo al login...'
    messageType.value = 'success'
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } else {
    message.value = result.message
    messageType.value = 'error'
  }
  
  loading.value = false
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f5f5;
  padding: 1rem;
}

.login-link {
  text-align: center;
  margin-top: 1rem;
}
</style>