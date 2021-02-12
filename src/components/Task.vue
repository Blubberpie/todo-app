<template>
  <div>
    <v-list
      class="transparent"
      v-for="(task, taskId) in tasks"
      v-bind:key="task.id"
    >
      <v-card class="task-card">
        <v-list-item>
          <v-list-item-action>
            <v-checkbox :input-value="task.isDone"/>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="thicc task-text" v-text="task.text"/>
          </v-list-item-content>
          <v-btn @click="newSubtask(task)"><v-icon>mdi-plus-circle</v-icon></v-btn>
          <v-btn @click="destroyTask(taskId)"><v-icon>mdi-delete</v-icon></v-btn>
        </v-list-item>
      </v-card>
      <subtask
        v-bind:task="task"
        @destroySubtask="onDestroySubtask"
      />
    </v-list>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/database';
import Subtask from './Subtask.vue';

const database = firebase.database();

export default {
  components: { Subtask },
  data() {
    return {
      editing: null,
      tasksRef: null,
    };
  },
  created() {
    this.tasksRef = database.ref(`/users/${this.$store.state.auth.user.uid}/tasks`);
  },
  props: ['tasks'],
  methods: {
    destroyTask(taskId) {
      const taskRef = this.tasksRef.child(taskId);
      taskRef.remove();
    },
    onDestroySubtask(task, subtask) {
      console.log('asdf', task, subtask);
      this.$store.dispatch('todos/destroySubtask', task, subtask);
    },
  },
};
</script>
