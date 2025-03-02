<template>
  <div>
    <h2>Zufälliger Rezept-Generator</h2>

    <!-- Rezept-Details mit bearbeitbaren Feldern -->
    <div v-if="recipe" class="recipe-card">
      <label><strong>Rezeptname:</strong></label>
      <input v-model="recipe.title" class="input" />

      <p><strong>Gemüse:</strong> {{ recipe.ingredients.vegetables }}</p>
      <p><strong>Proteine:</strong> {{ recipe.ingredients.proteins }}</p>
      <p><strong>Kohlenhydrate:</strong> {{ recipe.ingredients.carbs }}</p>
      <p><strong>Fette:</strong> {{ recipe.ingredients.fats }}</p>

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
//const backendUrl = "https://recipe-generator-backend-07g0.onrender.com"
const backendUrl = import.meta.env.VITE_BACKEND_URL;
//"http://127.0.0.1:5000

export default {
  data() {
    return {
      recipe: null,
      savedRecipes: []
    };
  },
  methods: {
    async generateRecipe() {
      try {
        const response = await axios.get(`${backendUrl}/generate`);
        console.log("Server Response:", response.data);
        this.recipe = response.data;
      } catch (error) {
        console.error("Fehler beim Generieren:", error);
      }
    },
    async saveRecipe() {
      if (!this.recipe) return;

      try {
        await axios.post(`${backendUrl}/save`, this.recipe);
        console.log("Rezept gespeichert!");
        alert("Rezept gespeichert!");
      } catch (error) {
        console.error("Fehler beim Speichern:", error);
      }
    },
    async loadRecipes() {
      try {
        const response = await axios.get(`${backendUrl}/load`);
        this.savedRecipes = response.data;
      } catch (error) {
        console.error("Fehler beim Laden:", error);
      }
    },
    async deleteRecipe() {
      if (!this.recipe) return;

      try {
        await axios.post(`${backendUrl}/delete`, { title: this.recipe.title });
        console.log("Rezept gelöscht!");
        alert("Rezept gelöscht!");

        // Entferne das Rezept aus der lokalen Liste
        this.savedRecipes = this.savedRecipes.filter(r => r.title !== this.recipe.title);

        // Rezept im Editor zurücksetzen
        this.recipe = null;
      } catch (error) {
        console.error("Fehler beim Löschen:", error);
      }
    },
    selectRecipe(selected) {
      this.recipe = JSON.parse(JSON.stringify(selected)); // Kopie, um Original nicht direkt zu ändern
    }
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