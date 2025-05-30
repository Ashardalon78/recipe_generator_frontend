import { createRouter, createWebHistory } from 'vue-router';
import UserSelectionView from '../views/UserSelectionView.vue';
import RecipeListView from '../views/RecipeListView.vue';
import RecipeDetailView from '../views/RecipeDetailView.vue';

const routes = [
  {
    path: '/',
    name: 'UserSelection',
    component: UserSelectionView
  },
  {
    path: '/recipes/:userId',
    name: 'RecipeList',
    component: RecipeListView,
    props: true
  },
  {
    path: '/users/:userId/recipes/:recipeId',
    name: 'RecipeDetail',
    component: RecipeDetailView,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;