<template>
  <div>
    <v-list
      class="transparent"
      v-for="(task, taskId) in tasks"
      v-bind:key="taskId"
    >
      <v-card
        :class="task.isDone ? 'task-card-completed' : 'task-card'"
        v-if="!task.isDone || !tasksHidden"
      >
        <v-list-item>
          <v-list-item-action>
            <v-checkbox
            :input-value="task.isDone"
            @change="toggleTaskDone($event, taskId)"
            />
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="thicc task-text" v-text="task.text"/>
            <v-list-item-subtitle v-if="task.completionDate">
              Finish by: {{ new Date(task.completionDate).toLocaleString('default', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              }) }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-btn
            icon
            large
            color="green lighten-2"
            @click="createSubtask(taskId)"><v-icon>mdi-plus-thick</v-icon></v-btn>
          <v-btn
            icon
            large
            color="red lighten-2"
            @click="destroyTask(taskId)"><v-icon>mdi-delete</v-icon></v-btn>
          <v-btn
            icon
            large
            v-if="task.subtasks"
            @click="toggleSubtasks(taskId)"><v-icon>mdi-chevron-down</v-icon></v-btn>
        </v-list-item>
        <v-progress-linear
          class="progress-bar"
          color="pink lighten-3"
          height="0.5rem"
          :value="checkProgress(task)"
        />
      </v-card>
      <subtask
        v-if="!task.isDone || !tasksHidden"
        :taskId="taskId"
        :subtasks="task.subtasks"
        :isCreating="isCreatingSubtask"
        :taskCreatingSubtask="taskCreatingSubtask"
        :showSubtasks="showSubtasks"
        :taskTogglingSubtasks="taskTogglingSubtasks"
        @pushNewSubtask="pushNewSubtask"
        @cancelCreateSubtask="cancelCreateSubtask"
        @destroySubtask="onDestroySubtask"
        @toggleSubtaskDone="toggleSubtaskDone"
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
      showSubtasks: false,
      taskTogglingSubtasks: '',
    };
  },
  created() {
    this.tasksRef = database.ref(`/users/${this.$store.state.auth.user.uid}/tasks`);
  },
  props: {
    tasks: {
      type: Object,
    },
    tasksHidden: {
      type: Boolean,
      default: false,
    },
  },
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
    toggleSubtasks(taskId) {
      this.showSubtasks = !this.showSubtasks;
      this.taskTogglingSubtasks = taskId;
    },
    pushNewSubtask(taskId, subtask) {
      this.isCreatingSubtask = false;
      const taskRef = this.tasksRef.child(taskId);
      this.showSubtasks = true;
      taskRef.child('subtasks').push({
        text: subtask.text.trim(),
        isDone: subtask.isDone,
      })
        .then(() => {
          // console.log('New subtask created!');
          this.allSubtasksDone(taskId);
        })
        .catch((error) => {
          console.log('Could not create subtask due to an error! Please try again later.', error);
        });
    },
    cancelCreateSubtask() {
      this.isCreatingSubtask = false;
    },
    onDestroySubtask(taskId, subtaskId) {
      const subtaskRef = this.tasksRef.child(`${taskId}/subtasks/${subtaskId}`);
      subtaskRef.remove()
        .catch((error) => {
          console.log('Could not remove subtask due to an error! Please try again later.', error);
        });
    },
    toggleTaskDone(isDone, taskId, toggleSubtasks = true) {
      const taskRef = this.tasksRef.child(taskId);
      taskRef.update({
        isDone,
      })
        .then(() => {
          if (toggleSubtasks) {
            if (this.markAllSubtasksDone(taskRef, isDone)) {
              // console.log('Toggled done!');
            } else {
              throw new Error('Could not toggle done!'); // does this work?
            }
          }
        })
        .catch((error) => {
          console.log('Could not toggle done due to an error! Please try again later.', error);
        });
    },
    markAllSubtasksDone(taskRef, isDone) {
      const subtasksRef = taskRef.child('subtasks');
      subtasksRef.once('value', (snapshot) => {
        snapshot.forEach((subtask) => {
          subtask.ref.update({
            isDone,
          })
            .catch((error) => {
              console.log('Could not toggle all subtasks done due to an error! Please try again later.', error);
              return false;
            });
        });
      });
      return true;
    },
    toggleSubtaskDone(isDone, taskId, subtaskId) {
      const subtaskRef = this.tasksRef.child(`${taskId}/subtasks/${subtaskId}`);
      subtaskRef.update({
        isDone,
      })
        .then(() => {
          // console.log('Toggled subtask done!');
          this.allSubtasksDone(taskId);
        })
        .catch((error) => {
          console.log('Could not toggle subtask done due to an error! Please try again later.', error);
        });
    },
    allSubtasksDone(taskId) {
      const subtasksRef = this.tasksRef.child(`${taskId}/subtasks`);
      let allDone = true;
      subtasksRef.once('value', (subtasksSnapshot) => {
        subtasksSnapshot.forEach((subtask) => {
          if (subtask.val().isDone === false) {
            allDone = false;
          }
        });
      });
      this.toggleTaskDone(allDone, taskId, false);
    },
    checkProgress(task) {
      let total = 0;
      let count = 0;
      if (Object.prototype.hasOwnProperty.call(task, 'subtasks')) {
        Object.entries(task.subtasks).forEach((subtask) => {
          if (subtask[1].isDone) {
            count += 1;
          }
          total += 1;
        });
      } else {
        return task.isDone * 100;
      }
      return (count / total) * 100;
    },
  },
};
</script>
