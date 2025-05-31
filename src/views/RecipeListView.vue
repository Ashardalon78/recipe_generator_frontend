<template>
  <div>
    <h2>Rezepte von User {{ user?.name || userId }}</h2>

    <button @click="goBack">Zurück zur Benutzerauswahl</button>
    <button @click="generateRecipe">Rezept generieren</button>

    <h3>Filter</h3>
    <div v-for="cat in Object.keys(categoryLabels)" :key="cat">
    <label>{{ categoryLabels[cat] }}</label>
    <select v-model="filters[cat]">
      <option value="">Keine Auswahl</option>
      <option v-for="opt in filterOptions[cat]" :key="opt" :value="opt">{{ opt }}</option>
    </select>
  </div>

    <RecipeCard
      v-for="recipe in filteredRecipes"
      :key="recipe.id"
      :recipe="recipe"
      @click="goToRecipeDetail(recipe.id)"
    />
  </div>
</template>

<script>
import axios from 'axios';
import RecipeCard from '../components/RecipeCard.vue'; // ggf. anpassen
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default {
  props: ['userId'],
  components: {
    RecipeCard
  },
  data() {
    return {
      recipes: [],
      user: null,
      filters: {
        vegetables: '',
        proteins: '',
        carbs: '',
        fats: ''
      },
      filterOptions: {
        vegetables: [],
        proteins: [],
        carbs: [],
        fats: []
      },
      categoryLabels: {
        vegetables: "Gemüse",
        proteins: "Proteine",
        carbs: "Kohlenhydrate",
        fats: "Fette"
      }
    };
  },
  computed: {
    filteredRecipes() {
      return this.recipes.filter(r => {
        const ing = r.ingredients || {};
        return (!this.filters.vegetables || ing.vegetables === this.filters.vegetables)
          && (!this.filters.proteins || ing.proteins === this.filters.proteins)
          && (!this.filters.carbs || ing.carbs === this.filters.carbs)
          && (!this.filters.fats || ing.fats === this.filters.fats);
      });
    }
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
        this.extractFilterOptions();
      } catch (e) {
        console.error('Fehler beim Laden der Rezepte:', e);
      }
    },
    extractFilterOptions() {
      const categories = ['vegetables', 'proteins', 'carbs', 'fats'];

      categories.forEach(category => {
        const values = new Set();
        this.recipes.forEach(recipe => {
          const value = recipe.ingredients?.[category];
          if (value) values.add(value);
        });
        this.filterOptions[category] = [...values];
      });
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