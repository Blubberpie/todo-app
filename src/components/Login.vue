<template>
  <div>
    <v-text-field
      v-model="username"
      placeholder="Enter your username"
      autofocus
    />
    <br>
    <v-text-field
      v-model="password"
      type="password"
      placeholder="Enter your password"
      @keyup.enter="doLogin"
      autofocus
    />
    <br>
    <p if="errorMessage">{{ errorMessage }}</p>
    <br>
    <v-btn @click="doLogin">Login</v-btn>
  </div>
</template>

<script>

import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  data() {
    return {
      username: 'lozberipie@gmail.com',
      password: 'qpwoeirutya;sldkfjgh',
      errorMessage: '',
    };
  },
  methods: {
    async doLogin() {
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
    },
  },
};
</script>
