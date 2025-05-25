<template>
    <div v-if="recipe && recipe.ingredients">
        <h2>{{ isNew ? 'Neues Rezept' : 'Rezept: ' + recipe.title }}</h2>

        <button @click="goBack">Zurück</button>

        <label>Rezeptname:</label>
        <input v-model="recipe.title" />

        <label>Gemüse:</label>
        <select v-model="recipe.ingredients.vegetables">
        <option disabled value="">Bitte auswählen</option>
        <option v-for="veg in ingredientOptions.vegetables" :key="veg" :value="veg">
            {{ veg }}
        </option>
        </select>

        <label>Proteine:</label>
        <select v-model="recipe.ingredients.proteins">
        <option disabled value="">Bitte auswählen</option>
        <option v-for="protein in ingredientOptions.proteins" :key="protein" :value="protein">
            {{ protein }}
        </option>
        </select>

        <label>Kohlenhydrate:</label>
        <select v-model="recipe.ingredients.carbs">
        <option disabled value="">Bitte auswählen</option>
        <option v-for="carb in ingredientOptions.carbs" :key="carb" :value="carb">
            {{ carb }}
        </option>
        </select>

        <label>Fette:</label>
        <select v-model="recipe.ingredients.fats">
        <option disabled value="">Bitte auswählen</option>
        <option v-for="fat in ingredientOptions.fats" :key="fat" :value="fat">
            {{ fat }}
        </option>
        </select>

        <label>Zubereitung:</label>
        <textarea v-model="recipe.instructions"></textarea>

        <button @click="saveRecipe">Speichern</button>
        <button @click="deleteRecipe" v-if="!isNew">Löschen</button>
    </div>
  
    <div v-else>
      <p>Lade Rezeptdaten...</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
  export default {
    props: ['userId', 'recipeId'],
    data() {
        return {
            recipe: null,
            isNew: false,
            ingredientOptions: {
            vegetables: [],
            proteins: [],
            carbs: [],
            fats: []
            }
        };
    },
    methods: {
        async loadRecipe() {
            if (this.recipeId === 'new') {
                this.isNew = true;

                try {
                const response = await axios.get(`${backendUrl}/generate/${this.userId}`);
                this.recipe = response.data;
                } catch (e) {
                console.error('Fehler beim Generieren des Rezepts:', e);
                this.recipe = {
                    title: '',
                    ingredients: {
                    vegetables: '',
                    proteins: '',
                    carbs: '',
                    fats: ''
                    },
                    instructions: ''
                };
                }

            } else {
                try {
                const response = await axios.get(`${backendUrl}/recipes/${this.userId}/${this.recipeId}`);
                const data = response.data;

                if (!data.ingredients) {
                    data.ingredients = {
                    vegetables: '',
                    proteins: '',
                    carbs: '',
                    fats: ''
                    };
                }

                this.recipe = data;
                } catch (e) {
                console.error('Fehler beim Laden des Rezepts:', e);
                }
            }
        },
      async saveRecipe() {
        try {
          if (this.isNew) {
            const response = await axios.post(`${backendUrl}/save`, {
            user_id: this.userId,
            title: this.recipe.title,
            ingredients: this.recipe.ingredients,
            instructions: this.recipe.instructions
            });
            alert('Rezept gespeichert');
            // Gehe zur neuen Rezeptdetail-Seite mit der neuen ID
            this.$router.push(`/users/${this.userId}/recipes/${response.data.id}`);
            this.goBack();
          } else {
            // Update Logik, wenn im Backend vorhanden (optional)
            alert('Update noch nicht implementiert');
          }
        } catch (e) {
          console.error(e);
        }
      },
      async deleteRecipe() {
        if (!this.isNew) {
          try {
            await axios.delete(`${backendUrl}/delete/${this.recipeId}`);
            alert('Rezept gelöscht');
            this.goBack();
          } catch (e) {
            console.error(e);
          }
        }
      },
      goBack() {
        this.$router.push({ name: 'RecipeList', params: { userId: this.userId } });
      },
      async loadIngredients() {
        try {
            const res = await axios.get(`${backendUrl}/ingredients`);
            this.ingredientOptions = res.data;
        } catch (error) {
            console.error('Fehler beim Laden der Zutaten:', error);
        }
     }

    },
    mounted() {
      this.loadIngredients();
      this.loadRecipe();
    }
  };
  </script>
  
