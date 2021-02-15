<template>
  <div>
    <v-row>
      <v-spacer/>
      <v-col
        cols="12"
        sm="8"
        md="6"
      >
        <h1 class="thick custom-title">Login to Access<br/>Your Todo List!</h1>
        <v-text-field
          solo
          v-model="username"
          placeholder="Enter your username"
          autofocus
        />
        <v-text-field
          solo
          v-model="password"
          type="password"
          placeholder="Enter your password"
          @keyup.enter="doLogin"
          autofocus
        />
        <p if="errorMessage">{{ errorMessage }}</p>
        <v-row class="pl-4 pr-4">
          <v-btn @click="goRegister">Create a New Account</v-btn>
          <v-spacer/>
          <v-btn @click="doLogin">Login</v-btn>
        </v-row>
      </v-col>
      <v-spacer/>
    </v-row>
  </div>
</template>

<script>

import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    async doLogin() {
      if (this.username && this.password) {
        await firebase.auth()
          .signInWithEmailAndPassword(this.username, this.password)
          .then((userCredential) => {
            const { user } = userCredential;
            this.$store.dispatch('auth/setAuthenticatedUser', user);
            this.$router.push({ name: 'todos' });
          })
          .catch((error) => {
            this.errorMessage = error.message;
          });
      } else {
        this.errorMessage = 'Cannot be empty!';
      }
    },
    goRegister() {
      this.$router.push({ name: 'register' });
    },
  },
};
</script>
