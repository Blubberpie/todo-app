<template>
  <v-app-bar app elevation="0">
    <v-spacer/>
    <v-col id=1 cols="4">
    </v-col>
    <v-col id=2 cols="4">
      <h2 class="thick" id="app-name">LYNE-UP</h2>
    </v-col>
    <v-col id=3 cols="4">
      <v-row>
        <v-spacer/>
        <v-btn v-if="loggedIn" @click="doLogout">Logout</v-btn>
      </v-row>
    </v-col>
  </v-app-bar>
</template>

<script>

import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  data() {
    return {
      loggedIn: false,
    };
  },
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      this.loggedIn = user;
    });
  },
  methods: {
    async doLogout() {
      await firebase.auth().signOut().then(() => {
        this.$router.push({ name: 'login' });
      });
    },
  },
};
</script>
