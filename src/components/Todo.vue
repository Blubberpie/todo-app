<template>
  <div>
    <v-row>
      <v-spacer/>
      <v-col
        cols="12"
        sm="12"
        md="7"
        >
        <v-row class="input-row">
          <v-col id="1" cols="10">
            <v-text-field solo
              id="new-task"
              v-model="todoText"
              :error-messages="creationError"
              placeholder="What needs to be done?"
              @keyup.enter="createTodo"
              autofocus
              />
          </v-col>
          <v-col id="2" cols="2">
            <v-menu
              class="test"
              transition="slide-x-transition"
              bottom left
              nudge-bottom="60"
              nudge-left="70"
              rounded="b-xl"
              :close-on-content-click="false"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  large
                  right
                  icon
                  light
                  v-bind="attrs"
                  v-on="on"
                ><v-icon>mdi-calendar</v-icon></v-btn>
              </template>
              <v-date-picker
                v-model="completionDate"
                class="mb-4"
                :min="new Date().toISOString().substr(0, 10)"
              />
            </v-menu>
            <v-btn
              large
              right
              icon
              @click="createTodo"
            ><v-icon>mdi-plus-thick</v-icon></v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col key=1 align-self="end">
            <v-switch
              v-model="tasksHidden"
              inset
              label="Hide completed"
            />
          </v-col>
          <v-col key=2 align-self="end">
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
            <v-col id=1 cols=5 align-self="end">
              <div
                class="outer-label thic"
                v-if="Object.keys(datedTasks).length !== 0"
              >YOUR PRIORITIES</div>
            </v-col>
            <v-col id=2 cols=7 align-self="end">
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
            class="outer-label thic text-center"
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
      creationError: [],
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
          this.creationError = [];
        })
          .catch((error) => {
            this.todoText = backupText;
            const errText = 'Could not add new task due to an error! Please try again later.';
            console.log(errText, error);
            this.creationError.push(errText);
          });
      } else {
        this.todoText = '';
        this.creationError.push('Please enter some text first!');
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
