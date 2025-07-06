<template>
  <div>
    <h2>Benutzer auswählen</h2>

    <select v-model="selectedUserId">
      <option disabled value="">Bitte auswählen</option>
      <option v-for="user in users" :key="user.id" :value="user.id">
        {{ user.name }}<span v-if="user.level"> ({{ user.level }})</span>
      </option>
    </select>

    <button @click="selectUser" :disabled="!selectedUserId">Weiter</button>

    <h3>Neuen Benutzer anlegen</h3>
    <input v-model="newUserName" placeholder="Name" />
    <button @click="createUser" :disabled="!newUserName">Anlegen</button>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const backendUrl = import.meta.env.VITE_BACKEND_URL
const router = useRouter()
const currentUser = inject('currentUser')

const users = ref([])
const selectedUserId = ref('')
const newUserName = ref('')

async function loadUsers() {
  try {
    const res = await axios.get(`${backendUrl}/users`)
    users.value = res.data
  } catch (e) {
    console.error('Fehler beim Laden der Benutzer:', e)
  }
}

async function selectUser() {
  const selectedUserIdVal = selectedUserId.value
  if (!selectedUserIdVal) return

  try {
    const res = await axios.get(`${backendUrl}/users/${selectedUserIdVal}`)
    const fullUser = res.data

    currentUser.id = fullUser.id
    currentUser.name = fullUser.name
    currentUser.level = fullUser.level

    router.push(`/recipes/${fullUser.id}`)
  } catch (err) {
    console.error('Fehler beim Laden des Benutzers:', err)
  }
}

async function createUser() {
  try {
    const res = await axios.post(`${backendUrl}/users`, {
      name: newUserName.value,
      level: 'user' // default Level
    })
    newUserName.value = ''
    await loadUsers()
    selectedUserId.value = res.data.id
  } catch (e) {
    console.error('Fehler beim Anlegen des Benutzers:', e)
  }
}

loadUsers()
</script>

  