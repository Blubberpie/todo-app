<template>
  <div id="app">
    <!--router-link :to="{ name: 'login' }">Go To Login Page</router-link-->
    <v-container>
      <v-col
        cols="12"
      >
        <v-card>
          <v-card-title>{{ title }}</v-card-title>
          <v-card-text>
            <v-text-field
            v-model="todoText"
            placeholder="What needs to be done?"
            @keyup.enter="createTodo"
            autofocus
            />
            <tasks/>
          </v-card-text>
        </v-card>
      </v-col>
    </v-container>
    <!-- <footnote /> -->
  </div>
</template>

<script>
// import TodoFooter from '@/components/TodoFooter.vue';
import Tasks from './Task.vue';
// import Footnote from './Footnote.vue';
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
      title: 'My Todo List',
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
