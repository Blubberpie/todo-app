<template>
  <div>
    <v-row>
      <v-spacer/>
      <v-col
        cols="12"
        sm="7"
        md="6"
        >
        <v-text-field solo id="new-task"
        v-model="todoText"
        placeholder="What needs to be done?"
        @keyup.enter="createTodo"
        autofocus
        />
        <div class="outer-label thic">THINGS TO DO</div>
        <tasks :tasks="tasks"/>
      </v-col>
      <v-spacer/>
    </v-row>
    <!-- <footnote /> -->
  </div>
</template>

<script>

import firebase from 'firebase/app';
import 'firebase/database';
import Tasks from './Task.vue';

const database = firebase.database();

export default {
  components: {
    Tasks,
  },
  data() {
    return {
      title: 'THINGS TO DO',
      todoText: '',
      editing: null,
      tasks: {},
      tasksRef: null,
    };
  },
  created() {
    this.tasksRef = database.ref(`/users/${this.$store.state.auth.user.uid}/tasks`);
  },
  mounted() {
    this.tasksRef.on('value', (snapshot) => {
      this.tasks = snapshot.val();
    });
  },
  methods: {
    createTodo() {
      this.tasksRef.push({ text: this.todoText.trim(), isDone: false });
    },
  },
};
</script>
