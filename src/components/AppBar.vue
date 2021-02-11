<template>
  <v-app-bar app elevation="0">
    <v-spacer/>
    <v-col
      cols="12"
      sm="4"
    >
      <h2 class="thick" id="app-name">THE TOODO</h2>
    </v-col>
    <v-btn @click="doLogout">Logout</v-btn>
  </v-app-bar>
</template>

<script>

import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  methods: {
    async doLogout() {
      await firebase.auth().signOut().then(() => {
        this.$router.push({ name: 'login' });
      });
    },
  },
};
</script>
