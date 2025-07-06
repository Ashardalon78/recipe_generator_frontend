<script setup>
import { ref, onMounted, inject } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const currentUser = inject('currentUser');
const router = useRouter();

const users = ref([]);
const selectedUserId = ref(null);

onMounted(async () => {
  try {
    const res = await axios.get(`${backendUrl}/users`);
    // nur User-Level "user"
    users.value = res.data.filter(u => u.level === 'user');
  } catch (e) {
    console.error('Fehler beim Laden der User:', e);
  }
});

function goToUserRecipes() {
  if (selectedUserId.value) {
        router.push({
        name: 'RecipeList',
        params: { userId: selectedUserId.value },
        query: { readonly: 'true' }
    });
  }
}
</script>

<template>
  <div>
    <h2>Coach-Modus</h2>
    <label>Wähle einen Benutzer:</label>
    <select v-model="selectedUserId">
      <option disabled value="">Bitte auswählen</option>
      <option v-for="user in users" :key="user.id" :value="user.id">
        {{ user.name }}
      </option>
    </select>
    <button @click="goToUserRecipes" :disabled="!selectedUserId">Rezepte anzeigen</button>
    <button @click="$router.push('/')">Zurück</button>
  </div>
</template>
