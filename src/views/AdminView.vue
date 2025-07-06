<template>
    <div class="p-4">
      <h1 class="text-xl font-bold mb-4">Admin-Funktionen</h1>
  
      <div class="mb-4">
        <label class="block mb-1">Neuen Coach anlegen</label>
        <input v-model="coachName" type="text" placeholder="Coach-Name"
               class="border p-2 rounded w-full mb-2" />
        <button @click="createCoach"
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Coach erstellen
        </button>
      </div>
  
      <div v-if="message" class="mt-2 text-green-700">{{ message }}</div>
      <div v-if="error" class="mt-2 text-red-600">{{ error }}</div>
  
      <button @click="$router.push('/')" class="mt-6 text-blue-500 underline">
        Zurück zur Startseite
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  
  const coachName = ref('')
  const message = ref('')
  const error = ref('')
  
  const createCoach = async () => {
    message.value = ''
    error.value = ''
  
    try {
      const response = await axios.post('http://localhost:5000/admin/create_coach', {
        caller: 'Ralf_Admin', // später dynamisch vom eingeloggten User
        coach_name: coachName.value
      })
  
      if (response.data?.name) {
        message.value = `Coach "${response.data.name}" erfolgreich angelegt.`
        coachName.value = ''
      }
    } catch (err) {
      error.value = err.response?.data?.error || 'Fehler beim Erstellen.'
    }
  }
  </script>
  