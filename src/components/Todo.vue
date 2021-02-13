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
            <v-switch
              v-model="tasksHidden"
              inset
              label="Hide completed"
            />
          </v-col>
          <v-col key=2>
            <v-dialog
              v-model="clearAllDialog"
              width="500"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                >Clear all completed</v-btn>
              </template>

              <v-card>
                <v-card-title>
                  This will permanently delete all completed tasks
                  from your list! Do you want to continue?
                </v-card-title>
                <v-btn @click="clearAllDialog = false">
                  Cancel
                </v-btn>
                <v-btn @click="clearAllCompleted">
                  Delete completed
                </v-btn>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>
        <br/>
        <div>
          <v-row>
            <v-col id=1 cols=5>
              <div
                class="outer-label thic"
                v-if="Object.keys(datedTasks).length !== 0"
              >YOUR PRIORITIES</div>
            </v-col>
            <v-col id=2 cols=7>
              <div
              class="outer-label thic text-right"
              v-if="Object.keys(datedTasks).length !== 0"
            >
              <div>
                COMPLETED: <span class="tiny-card spruce-text">
                  {{ completedCount }}
                </span>
              </div>
              <div>
                REMAINING: <span class="tiny-card spruce-text">
                  {{ incompletedCount }}
                </span>
              </div>
            </div>
            </v-col>
          </v-row>
          <tasks :tasks="datedTasks" :tasksHidden="tasksHidden"/>
          <br/>
          <div
            class="outer-label thic"
            v-if="Object.keys(undatedTasks).length !== 0"
          >UNDATED TASKS</div>
          <tasks :tasks="undatedTasks" :tasksHidden="tasksHidden"/>
          <div
            class="outer-label thic"
            v-if="Object.keys(undatedTasks).length === 0 && Object.keys(datedTasks).length === 0"
          >YOU HAVE NO TASKS</div>
        </div>
      </v-col>
      <v-spacer/>
    </v-row>
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
      clearAllDialog: false,
      tasksHidden: false,
      completedCount: 0,
      incompletedCount: 0,
    };
  },
  created() {
    this.tasksRef = database.ref(`/users/${this.$store.state.auth.user.uid}/tasks`);
  },
  mounted() {
    this.tasksRef.orderByChild('completionDate').on('value', (snapshot) => {
      const reorderedTasks = {};
      const undatedTasks = {};
      let completed = 0;
      let incompleted = 0;
      snapshot.forEach((task) => {
        if (Object.prototype.hasOwnProperty.call(task.val(), 'completionDate')) {
          reorderedTasks[task.key] = task.val();
        } else {
          undatedTasks[task.key] = task.val();
        }
        if (task.val().isDone) {
          completed += 1;
        } else {
          incompleted += 1;
        }
      });
      this.datedTasks = reorderedTasks;
      this.undatedTasks = undatedTasks;
      this.completedCount = completed;
      this.incompletedCount = incompleted;
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
      this.clearAllDialog = false;
    },
  },
};
</script>
