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
        <tasks/>
      </v-col>
      <v-spacer/>
    </v-row>
    <!-- <footnote /> -->
  </div>
</template>

<script>

import Tasks from './Task.vue';
// import firebase from 'firebase/app';
// import 'firebase/database';

// const LOCAL_STORAGE_KEY = "todo-app-vue";

// const database = firebase.database();

export default {
  components: {
    Tasks,
  },
  data() {
    return {
      title: 'THINGS TO DO',
      todoText: '',
      editing: null,
    };
  },
  methods: {
    createTodo() {
      this.$store.dispatch('todos/createTodo', { text: this.todoText.trim(), isDone: false });
      this.todoText = '';
    },
    clearCompleted() {
      this.$store.dispatch('todos/clearCompleted');
    },
  },
  computed: {
    todos() {
      return this.$store.state.todos.todos;
    },
  },
};
</script>
