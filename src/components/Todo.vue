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
        <v-date-picker
          v-model="completionDate"
          class="mb-4"
          :min="new Date().toISOString().substr(0, 10)"
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
      completionDate: null,
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
      if (this.todoText.trim()) {
        const backupText = this.todoText;
        this.todoText = '';
        this.tasksRef.push({
          text: backupText.trim(),
          isDone: false,
          completionDate: this.completionDate,
        }).then(() => {
          this.completionDate = null;
        })
          .catch((error) => {
            this.todoText = backupText;
            console.log('Could not add new task due to an error! Please try again later.', error);
          });
      } else {
        this.todoText = '';
        // TODO: show error: cannot be empty!
      }
    },
  },
};
</script>
