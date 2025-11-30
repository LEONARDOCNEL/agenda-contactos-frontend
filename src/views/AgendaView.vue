<template>
  <div class="agenda-container">
    <header class="header">
      <h1>Mi Agenda de Contactos</h1>
      <div class="header-actions">
        <router-link to="/agenda/crear" class="btn btn-primary">
          Nuevo Contacto
        </router-link>
        <router-link to="/perfil" class="btn btn-secondary">
          Mi Perfil
        </router-link>
        <button @click="authStore.logout()" class="btn btn-delete">
          Cerrar Sesión
        </button>
      </div>
    </header>

    <div class="search-bar">
      <input 
        type="text" 
        v-model="searchTerm" 
        placeholder="Buscar contactos por nombre, apellido, teléfono o email..." 
        @input="filterContacts"
        class="search-input"
      >
    </div>

    <div v-if="loading" class="loading">Cargando contactos...</div>
    
    <div v-else-if="filteredContacts.length === 0" class="empty-state">
      <p v-if="searchTerm">No se encontraron contactos que coincidan con "{{ searchTerm }}"</p>
      <p v-else>No tienes contactos aún. <router-link to="/agenda/crear">¡Crea tu primer contacto!</router-link></p>
    </div>

    <div v-else class="contacts-grid">
      <div 
        v-for="contact in filteredContacts" 
        :key="contact.id" 
        class="contact-card"
      >
        <div class="contact-info">
          <h3>{{ contact.nombre }} {{ contact.apellido }}</h3>
          <p><strong>📞 Teléfono:</strong> {{ contact.telefono }}</p>
          <p v-if="contact.email"><strong>📧 Email:</strong> {{ contact.email }}</p>
          <p v-if="contact.direccion"><strong>🏠 Dirección:</strong> {{ contact.direccion }}</p>
          <p v-if="contact.notas"><strong>📝 Notas:</strong> {{ contact.notas }}</p>
          <small class="date">Creado: {{ formatDate(contact.fecha_creacion) }}</small>
        </div>
        <div class="contact-actions">
          <router-link 
            :to="`/agenda/editar/${contact.id}`" 
            class="btn btn-edit"
          >
            Editar
          </router-link>
          <button 
            @click="confirmDelete(contact)" 
            class="btn btn-delete"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <div v-if="showDeleteModal" class="modal">
      <div class="modal-content">
        <h3>Confirmar Eliminación</h3>
        <p>¿Estás seguro de que quieres eliminar a <strong>{{ contactToDelete?.nombre }} {{ contactToDelete?.apellido }}</strong>?</p>
        <div class="modal-actions">
          <button @click="deleteContact" class="btn btn-delete">Eliminar</button>
          <button @click="cancelDelete" class="btn btn-secondary">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'

const authStore = useAuthStore()

const contacts = ref([])
const loading = ref(false)
const searchTerm = ref('')
const showDeleteModal = ref(false)
const contactToDelete = ref(null)

const filteredContacts = computed(() => {
  if (!searchTerm.value) {
    return contacts.value
  }
  
  const term = searchTerm.value.toLowerCase()
  return contacts.value.filter(contact => 
    contact.nombre.toLowerCase().includes(term) ||
    contact.apellido?.toLowerCase().includes(term) ||
    contact.telefono.includes(term) ||
    contact.email?.toLowerCase().includes(term)
  )
})

const loadContacts = async () => {
  loading.value = true
  try {
    const response = await api.get('/contactos/')
    if (response.data.success) {
      contacts.value = response.data.data
    }
  } catch (error) {
    console.error('Error cargando contactos:', error)
  } finally {
    loading.value = false
  }
}

const confirmDelete = (contact) => {
  contactToDelete.value = contact
  showDeleteModal.value = true
}

const cancelDelete = () => {
  showDeleteModal.value = false
  contactToDelete.value = null
}

const deleteContact = async () => {
  try {
    const response = await api.delete(`/contactos/eliminar.php?id=${contactToDelete.value.id}`)
    if (response.data.success) {
      await loadContacts()
      showDeleteModal.value = false
      contactToDelete.value = null
    }
  } catch (error) {
    console.error('Error eliminando contacto:', error)
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
  loadContacts()
})
</script>

<style scoped>
.agenda-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}
</style>