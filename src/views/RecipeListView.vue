<template>
  <div>
    <h2>Rezepte von User {{ user?.name || userId }}</h2>

    <button @click="goBack">Zurück zur Benutzerauswahl</button>
    <button v-if="!readonly" @click="generateRecipe">Rezept generieren</button>

    <!-- Coach-Funktionen-Button -->
  <button
    v-if="['admin', 'coach'].includes(currentUser?.level)"
    @click="$router.push('/coach')"
    class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ml-2">
    Coach-Funktionen
  </button>

    <!-- Admin-Funktionen-Button -->
    <button
      v-if="currentUser?.level === 'admin'"
      @click="goToAdmin"
      class="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
      Admin-Funktionen
    </button>

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
      @click="readonly ? null : goToRecipeDetail(recipe.id)"
    />
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import RecipeCard from '../components/RecipeCard.vue'

const { readonly } = defineProps({
  readonly: Boolean
})
const currentUser = inject('currentUser')
const backendUrl = import.meta.env.VITE_BACKEND_URL

const route = useRoute()
const router = useRouter()
const userId = route.params.userId

const user = ref(null)
const recipes = ref([])

const filters = ref({
  vegetables: '',
  proteins: '',
  carbs: '',
  fats: ''
})

const filterOptions = ref({
  vegetables: [],
  proteins: [],
  carbs: [],
  fats: []
})

const categoryLabels = {
  vegetables: "Gemüse",
  proteins: "Proteine",
  carbs: "Kohlenhydrate",
  fats: "Fette"
}

const filteredRecipes = computed(() => {
  return recipes.value.filter(r => {
    const ing = r.ingredients || {}
    return (!filters.value.vegetables || ing.vegetables === filters.value.vegetables)
      && (!filters.value.proteins || ing.proteins === filters.value.proteins)
      && (!filters.value.carbs || ing.carbs === filters.value.carbs)
      && (!filters.value.fats || ing.fats === filters.value.fats)
  })
})

async function loadUser() {
  try {
    const res = await axios.get(`${backendUrl}/users/${userId}`)
    user.value = res.data
  } catch (e) {
    console.error('Fehler beim Laden des Benutzers:', e)
  }
}

async function loadRecipes() {
  try {
    const res = await axios.get(`${backendUrl}/recipes/${userId}`)
    recipes.value = res.data
    extractFilterOptions()
  } catch (e) {
    console.error('Fehler beim Laden der Rezepte:', e)
  }
}

function extractFilterOptions() {
  const categories = ['vegetables', 'proteins', 'carbs', 'fats']
  categories.forEach(category => {
    const values = new Set()
    recipes.value.forEach(recipe => {
      const val = recipe.ingredients?.[category]
      if (val) values.add(val)
    })
    filterOptions.value[category] = [...values]
  })
}

function goBack() {
  router.push({ name: 'UserSelection' })
}

function generateRecipe() {
  router.push({ name: 'RecipeDetail', params: { userId, recipeId: 'new' } })
}

function goToRecipeDetail(recipeId) {
  router.push({ name: 'RecipeDetail', params: { userId, recipeId } })
}

function goToAdmin() {
  router.push({ name: 'AdminView' })
}

onMounted(() => {
  loadUser()
  loadRecipes()
})
</script>
