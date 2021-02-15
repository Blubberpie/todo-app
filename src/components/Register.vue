<template>
  <div>
    <v-row>
      <v-spacer/>
      <v-col
        cols="12"
        sm="8"
        md="6"
      >
        <h1 class="thick custom-title">Register to Start Creating <br/>Your Todo List!</h1>
        <v-text-field
          solo
          v-model="username"
          placeholder="Enter your email address"
          autofocus
        />
        <v-text-field
          solo
          v-model="password"
          type="password"
          placeholder="Enter your password"
          autofocus
        />
        <v-text-field
          solo
          v-model="passwordConfirm"
          type="password"
          placeholder="Enter your password again"
          @keyup.enter="doRegister"
          autofocus
        />
        <p if="errorMessage">{{ errorMessage }}</p>
        <v-row class="pr-4">
          <v-spacer/>
          <v-btn @click="doRegister">Register</v-btn>
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
      passwordConfirm: '',
      errorMessage: '',
    };
  },
  methods: {
    async doRegister() {
      if (this.username && this.password && this.passwordConfirm) {
        if (this.password === this.passwordConfirm) {
          await firebase.auth()
            .createUserWithEmailAndPassword(this.username, this.password)
            .then((userCredential) => {
              const { user } = userCredential;
              this.$store.dispatch('auth/setAuthenticatedUser', user);
              this.$router.push({ name: 'todos' });
            })
            .catch((error) => {
              this.errorMessage = error.message;
            });
        } else {
          this.errorMessage = 'Passwords do not match!';
        }
      } else {
        this.errorMessage = 'Cannot be empty!';
      }
    },
  },
};
</script>
