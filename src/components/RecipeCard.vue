<template>
  <div class="recipe-card" @click="openDetail">
    <h4>{{ recipe.title }}</h4>
    <ul>
      <li><strong>Protein:</strong> {{ recipe.ingredients.proteins }}</li>
      <li><strong>Kohlenhydrate:</strong> {{ recipe.ingredients.carbs }}</li>
      <li><strong>Gemüse:</strong> {{ recipe.ingredients.vegetables }}</li>
      <li><strong>Fett:</strong> {{ recipe.ingredients.fats }}</li>
    </ul>
    <p class="instructions">{{ recipe.instructions }}</p>
  </div>
</template>

<script>
export default {
  name: 'RecipeCard',
  props: {
    recipe: Object
  },
  methods: {
    openDetail() {
      this.$emit('click', this.recipe.id);
    }
  }
};
</script>

<style scoped>
.recipe-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  margin: 0.5rem 0;
  cursor: pointer;
  background: #f9f9f9;
  transition: background 0.3s;
}
.recipe-card h4 {
  margin-top: 0.0rem; /* vorher evtl. 1em durch Browser-Default */
  margin-bottom: 0.5rem;
}
.recipe-card:hover {
  background: #f0f0f0;
}

.instructions {
  margin-top: 0.5rem;
  font-size: 0.95rem;
  color: #555;
  white-space: pre-wrap;
}
</style>