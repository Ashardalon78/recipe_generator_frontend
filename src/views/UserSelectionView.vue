<template>
    <div>
      <h2>Benutzer auswählen</h2>
      <select v-model="currentUserId">
        <option disabled value="">Bitte wählen</option>
        <option v-for="user in users" :key="user.id" :value="user.id">
          {{ user.name }}
        </option>
      </select>
      <button :disabled="!currentUserId" @click="goToRecipes">Rezepte laden</button>
  
      <h3>Neuen Benutzer anlegen</h3>
      <input v-model="newUserName" placeholder="Name des neuen Benutzers" />
      <button @click="createUser" :disabled="!newUserName">Anlegen</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
  export default {
    data() {
      return {
        users: [],
        currentUserId: '',
        newUserName: ''
      };
    },
    methods: {
      async loadUsers() {
        try {
          const res = await axios.get(`${backendUrl}/users`);
          this.users = res.data;
        } catch (e) {
          console.error(e);
        }
      },
      goToRecipes() {
        if (this.currentUserId) {
          this.$router.push({ name: 'RecipeList', params: { userId: this.currentUserId } });
        }
      },
      async createUser() {
        try {
          const res = await axios.post(`${backendUrl}/register`, {
            name: this.newUserName
          });
          const newUser = res.data;
          this.users.push(newUser); // Direkt zur Liste hinzufügen
          this.currentUserId = newUser.id;
          this.newUserName = '';
          this.goToRecipes(); // Automatisch zur Rezeptliste weiterleiten
        } catch (e) {
          if (e.response?.status === 409) {
            alert("Benutzername existiert bereits.");
          } else {
            console.error("Fehler beim Anlegen des Benutzers:", e);
          }
        }
      }
    },
    mounted() {
      this.loadUsers();
    }
  };
  </script>
  