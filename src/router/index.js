import { createRouter, createWebHistory } from 'vue-router';
import UserSelectionView from '../views/UserSelectionView.vue';
import RecipeListView from '../views/RecipeListView.vue';
import RecipeDetailView from '../views/RecipeDetailView.vue';
import AdminView from '../views/AdminView.vue';
import CoachView from '../views/CoachView.vue';

const routes = [
  {
    path: '/',
    name: 'UserSelection',
    component: UserSelectionView
  },
  {
    path: '/users/:userId/recipes/:recipeId',
    name: 'RecipeDetail',
    component: RecipeDetailView,
    props: true
  },
  {
    path: '/admin',
    name: 'AdminView',
    component: AdminView
  },
  {
    path: '/coach',
    name: 'CoachView',
    component: CoachView
  },
  {
    path: '/recipes/:userId',
    name: 'RecipeList',
    component: RecipeListView,
    props: route => ({
      userId: route.params.userId,
      readonly: route.query.readonly === 'true'
    })
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;