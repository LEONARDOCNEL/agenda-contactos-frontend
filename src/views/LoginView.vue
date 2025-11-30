<template>
  <div class="login-container">
    <div class="card" style="max-width: 400px;">
      <h2>Iniciar Sesión</h2>
      <form @submit.prevent="handleLogin">
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
        
        <button type="submit" class="btn btn-primary" :disabled="loading" style="width: 100%;">
          {{ loading ? 'Iniciando...' : 'Iniciar Sesión' }}
        </button>
        
        <p class="register-link">
          ¿No tienes cuenta? <router-link to="/registro">Regístrate aquí</router-link>
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
  password: ''
})

const errors = reactive({
  username: '',
  password: ''
})

const validateForm = () => {
  let isValid = true
  
  errors.username = ''
  errors.password = ''
  
  if (!form.username.trim()) {
    errors.username = 'El usuario es obligatorio'
    isValid = false
  }
  
  if (!form.password) {
    errors.password = 'La contraseña es obligatoria'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres'
    isValid = false
  }
  
  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) return
  
  loading.value = true
  message.value = ''
  
  const result = await authStore.login(form.username, form.password)
  
  if (result.success) {
    message.value = '¡Login exitoso!'
    messageType.value = 'success'
    setTimeout(() => {
      router.push('/agenda')
    }, 1000)
  } else {
    message.value = result.message
    messageType.value = 'error'
  }
  
  loading.value = false
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f5f5;
  padding: 1rem;
}

.register-link {
  text-align: center;
  margin-top: 1rem;
}
</style>