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
        <v-row>
          <v-col key=1>
            <v-btn>Hide completed</v-btn>
          </v-col>
          <v-col key=2>
            <v-btn @click="clearAllCompleted">Clear all completed</v-btn>
          </v-col>
        </v-row>
        <br/>
        <div
          class="outer-label thic"
          v-if="Object.keys(datedTasks).length !== 0"
        >YOUR PRIORITIES</div>
        <tasks :tasks="datedTasks"/>
        <br/>
        <div
          class="outer-label thic"
          v-if="Object.keys(undatedTasks).length !== 0"
        >UNDATED TASKS</div>
        <tasks :tasks="undatedTasks"/>
        <div
          class="outer-label thic"
          v-if="Object.keys(undatedTasks).length === 0 && Object.keys(datedTasks).length === 0"
        >YOU HAVE NO TASKS</div>
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
      datedTasks: {},
      undatedTasks: {},
      tasksRef: null,
      completionDate: null,
    };
  },
  created() {
    this.tasksRef = database.ref(`/users/${this.$store.state.auth.user.uid}/tasks`);
  },
  mounted() {
    this.tasksRef.orderByChild('completionDate').on('value', (snapshot) => {
      const reorderedTasks = {};
      const undatedTasks = {};
      snapshot.forEach((task) => {
        if (Object.prototype.hasOwnProperty.call(task.val(), 'completionDate')) {
          reorderedTasks[task.key] = task.val();
        } else {
          undatedTasks[task.key] = task.val();
        }
      });
      this.datedTasks = reorderedTasks;
      this.undatedTasks = undatedTasks;
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
    clearAllCompleted() {
      [this.datedTasks, this.undatedTasks].forEach((tasks) => {
        Object.entries(tasks).forEach((task) => {
          const [taskKey, taskValue] = task;
          if (taskValue.isDone) {
            this.tasksRef.child(taskKey).remove()
              .catch((error) => {
                console.log('Could not remove task due to an error!', error);
              });
          }
        });
      });
    },
  },
};
</script>
