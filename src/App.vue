<template>
  <v-app>
    <app-bar/>
    <v-main>
      <v-container fluid>
        <router-view/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

import AppBar from './components/AppBar.vue';

export default {
  name: 'app',
  components: {
    AppBar,
  },
};
</script>
