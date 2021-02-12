<template>
  <div>
    <v-list
      class="transparent"
      v-for="(task, taskId) in tasks"
      v-bind:key="taskId"
    >
      <v-card class="task-card">
        <v-list-item>
          <v-list-item-action>
            <v-checkbox :input-value="task.isDone"/>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="thicc task-text" v-text="task.text"/>
          </v-list-item-content>
          <v-btn @click="createSubtask(taskId)"><v-icon>mdi-plus-circle</v-icon></v-btn>
          <v-btn @click="destroyTask(taskId)"><v-icon>mdi-delete</v-icon></v-btn>
        </v-list-item>
      </v-card>
      <subtask
        v-bind:taskId="taskId"
        v-bind:subtasks="task.subtasks"
        v-bind:isCreating="isCreatingSubtask"
        v-bind:taskCreatingSubtask="taskCreatingSubtask"
        @pushNewSubtask="pushNewSubtask"
        @cancelCreateSubtask="cancelCreateSubtask"
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
      isCreatingSubtask: false,
      taskCreatingSubtask: '',
    };
  },
  created() {
    this.tasksRef = database.ref(`/users/${this.$store.state.auth.user.uid}/tasks`);
  },
  props: ['tasks'],
  methods: {
    destroyTask(taskId) {
      const taskRef = this.tasksRef.child(taskId);
      taskRef.remove()
        .catch((error) => {
          console.log('Could not remove task due to an error! Please try again later.', error);
        });
    },
    createSubtask(taskId) {
      this.isCreatingSubtask = true;
      this.taskCreatingSubtask = taskId;
    },
    pushNewSubtask(taskId, subtask) {
      this.isCreatingSubtask = false;
      const taskRef = this.tasksRef.child(taskId);
      taskRef.child('subtasks').push({
        text: subtask.text,
        isDone: subtask.isDone,
      })
        .then(() => {
          console.log('done!');
        })
        .catch((error) => {
          console.log('Could not create subtask due to an error! Please try again later.', error);
        });
    },
    cancelCreateSubtask() {
      this.isCreatingSubtask = false;
    },
    onDestroySubtask(task, subtask) {
      console.log('asdf', task, subtask);
      this.$store.dispatch('todos/destroySubtask', task, subtask);
    },
  },
};
</script>
