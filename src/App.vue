<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { provide, reactive } from 'vue'

// Reaktives currentUser-Objekt, damit alle Komponenten reagieren
const currentUser = reactive({
  id: null,
  name: null,
  level: null
})

// Bereitstellen für alle Kind-Komponenten
provide('currentUser', currentUser)
</script>
