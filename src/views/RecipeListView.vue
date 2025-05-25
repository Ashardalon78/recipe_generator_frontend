<template>
    <div>
      <h2>Rezepte von User {{ user?.name || userId }}</h2>
  
      <button @click="goBack">Zurück zur Benutzerauswahl</button>
      <button @click="generateRecipe">Rezept generieren</button>
  
      <ul>
        <li v-for="recipe in recipes" :key="recipe.id" @click="goToRecipeDetail(recipe.id)">
          {{ recipe.title }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
  export default {
    props: ['userId'],
    data() {
      return {
        user: null,
        recipes: []
      };
    },
    methods: {
      async loadUser() {
        try {
          const res = await axios.get(`${backendUrl}/users/${this.userId}`);
          this.user = res.data;
        } catch (e) {
          console.error(e);
        }
      },
      async loadRecipes() {
        try {
          const res = await axios.get(`${backendUrl}/recipes/${this.userId}`);
          this.recipes = res.data;
        } catch (e) {
          console.error(e);
        }
      },
      goBack() {
        this.$router.push({ name: 'UserSelection' });
      },
      generateRecipe() {
        this.$router.push({ name: 'RecipeDetail', params: { userId: this.userId, recipeId: 'new' } });
      },
      goToRecipeDetail(recipeId) {
        this.$router.push({ name: 'RecipeDetail', params: { userId: this.userId, recipeId } });
      }
    },
    mounted() {
      this.loadUser();
      this.loadRecipes();
    }
  };
  </script>