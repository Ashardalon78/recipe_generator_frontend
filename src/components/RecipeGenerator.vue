<template>
  <div>
    <h2>Zufälliger Rezept-Generator</h2>

    <!-- Benutzer Dropdown und Registrierung -->
    <div>
      <h3>Benutzer auswählen:</h3>
      <select v-model="currentUser" @change="loadUserRecipes">
        <option disabled value="">Wählen Sie einen Benutzer</option>
        <option v-for="user in users" :key="user.id" :value="user">
          {{ user.name }}
        </option>
      </select>

      <button @click="showRegisterForm = !showRegisterForm" class="btn">
        Neuen Benutzer registrieren
      </button>

      <div v-if="showRegisterForm">
        <input v-model="newUserName" placeholder="Benutzername" class="input" />
        <button @click="registerUser" class="btn">Bestätigen</button>
      </div>
    </div>

    <!-- Rezept-Details mit bearbeitbaren Feldern -->
    <div v-if="recipe" class="recipe-card">
      <label><strong>Rezeptname:</strong></label>
      <input v-model="recipe.title" class="input" />

      <div>
        <label><strong>Gemüse:</strong></label>
        <select v-model="recipe.ingredients.vegetables" class="input">
          <option v-for="veg in availableIngredients.vegetables" :key="veg" :value="veg">{{ veg }}</option>
        </select>
      </div>

      <div>
        <label><strong>Proteine:</strong></label>
        <select v-model="recipe.ingredients.proteins" class="input">
          <option v-for="protein in availableIngredients.proteins" :key="protein" :value="protein">{{ protein }}</option>
        </select>
      </div>

      <div>
        <label><strong>Kohlenhydrate:</strong></label>
        <select v-model="recipe.ingredients.carbs" class="input">
          <option v-for="carb in availableIngredients.carbs" :key="carb" :value="carb">{{ carb }}</option>
        </select>
      </div>

      <div>
        <label><strong>Fette:</strong></label>
        <select v-model="recipe.ingredients.fats" class="input">
          <option v-for="fat in availableIngredients.fats" :key="fat" :value="fat">{{ fat }}</option>
        </select>
      </div>

      <label><strong>Zubereitung:</strong></label>
      <textarea v-model="recipe.instructions" class="input"></textarea>

      <button @click="saveRecipe" class="btn">Rezept speichern</button>
      <button @click="deleteRecipe" class="btn delete-btn" v-if="recipe">Rezept löschen</button>
    </div>

    <!-- Buttons für Generieren & Laden -->
    <button @click="generateRecipe" class="btn">Rezept generieren</button>
    <button @click="loadRecipes" class="btn">Gespeicherte Rezepte laden</button>

    <!-- Liste der gespeicherten Rezepte -->
    <div v-if="savedRecipes.length > 0">
      <h3>Gespeicherte Rezepte:</h3>
      <ul>
        <li v-for="(saved, index) in savedRecipes" :key="index" @click="selectRecipe(saved)" class="recipe-list-item">
          <strong>{{ saved.title }}</strong>: 
          {{ saved.ingredients.vegetables }}, 
          {{ saved.ingredients.proteins }}, 
          {{ saved.ingredients.carbs }}, 
          {{ saved.ingredients.fats }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default {
  data() {
    return {
      recipe: null,
      savedRecipes: [],
      currentUser: null,
      users: [],
      newUserName: "",
      showRegisterForm: false,
      availableIngredients: {
        vegetables: [],
        proteins: [],
        carbs: [],
        fats: []
      }
    };
  },
  methods: {
    async loadIngredients() {
      try {
        const response = await axios.get(`${backendUrl}/ingredients`);
        this.availableIngredients = response.data;
      } catch (error) {
        console.error("Fehler beim Laden der Zutaten:", error);
      }
    },
    async generateRecipe() {
      try {
        if (!this.currentUser) {
          console.error("Kein Benutzer ausgewählt!");
          return;
        }

        const response = await axios.get(`${backendUrl}/generate/${this.currentUser.id}`);
        console.log("Server Response:", response.data);
        this.recipe = response.data;
      } catch (error) {
        console.error("Fehler beim Generieren:", error);
      }
    },
    async saveRecipe() {
      if (!this.currentUser) {
        alert("Bitte wähle einen Benutzer aus!");
        return;
      }

      if (!this.recipe) return;

      try {
        await axios.post(`${backendUrl}/save`, {
          user_id: this.currentUser.id,
          title: this.recipe.title,
          ingredients: this.recipe.ingredients,
          instructions: this.recipe.instructions
        });
        console.log("Rezept gespeichert!");
        alert("Rezept gespeichert!");
      } catch (error) {
        console.error("Fehler beim Speichern:", error);
      }
    },
    async deleteRecipe() {
      if (!this.recipe || !this.recipe.id) return;

      try {
        await axios.delete(`${backendUrl}/delete/${this.recipe.id}`);
        console.log("Rezept gelöscht!");
        alert("Rezept gelöscht!");

        this.savedRecipes = this.savedRecipes.filter(r => r.id !== this.recipe.id);
        this.recipe = null;
      } catch (error) {
        console.error("Fehler beim Löschen:", error);
      }
    },
    async loadRecipes() {
      if (!this.currentUser) {
        alert("Bitte wähle einen Benutzer aus!");
        return;
      }

      try {
        const response = await axios.get(`${backendUrl}/recipes/${this.currentUser.id}`);
        this.savedRecipes = response.data;
      } catch (error) {
        console.error("Fehler beim Laden:", error);
      }
    },
    selectRecipe(selected) {
      this.recipe = JSON.parse(JSON.stringify(selected));
    },
    async loadUsers() {
      try {
        const response = await axios.get(`${backendUrl}/users`);
        this.users = response.data;
      } catch (error) {
        console.error("Fehler beim Laden der Benutzer:", error);
      }
    },
    async registerUser() {
      if (!this.newUserName) return;

      try {
        const response = await axios.post(`${backendUrl}/register`, { name: this.newUserName });
        console.log("User registriert:", response.data);

        this.users.push(response.data);
        this.currentUser = response.data;
        this.newUserName = "";
        this.isRegistering = false;
      } catch (error) {
        console.error("Fehler bei der Registrierung:", error);
      }
    },
    loadUserRecipes() {
      this.loadRecipes();
    }
  },
  mounted() {
    this.loadUsers();
    this.loadIngredients();
  }
};
</script>

<style>
.btn {
  margin-right: 10px;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.delete-btn {
  background-color: #dc3545;
}

.input {
  display: block;
  width: 100%;
  padding: 5px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.recipe-card {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
}

.recipe-list-item {
  cursor: pointer;
  padding: 5px;
  border-bottom: 1px solid #ddd;
}

.recipe-list-item:hover {
  background-color: #f5f5f5;
}
</style>