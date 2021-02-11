<template>
  <div>
    <v-list
      class="transparent"
      v-for="task in tasks"
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
          <v-btn @click="destroyTask(task)"><v-icon>mdi-delete</v-icon></v-btn>
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
import Subtask from './Subtask.vue';

export default {
  components: { Subtask },
  data() {
    return {
      editing: null,
    };
  },
  props: ['tasks'],
  methods: {
    destroyTask(task) {
      this.$store.dispatch('todos/destroyTask', task);
    },
    startEditing(task) {
      this.editing = task;
    },
    finishEditing(event) {
      if (!this.editing) {
        return;
      }
      const textbox = event.target;
      this.editing.text = textbox.value.trim();
      this.editing = null;
    },
    cancelEditing() {
      this.editing = null;
    },
    onDestroySubtask(task, subtask) {
      console.log('asdf', task, subtask);
      this.$store.dispatch('todos/destroySubtask', task, subtask);
    },
  },
};
</script>
