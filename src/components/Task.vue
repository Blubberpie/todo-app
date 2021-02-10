<template>
  <div>
    <v-list
      v-for="task in todos"
      v-bind:key="task.id"
    >
      <v-list-item>
        <v-list-item-action>
          <v-checkbox :input-value="task.isDone"/>
        </v-list-item-action>

        <v-list-item-content>
          <v-list-item-title v-text="task.text"/>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
// import Subtask from './Subtask.vue';

export default {
  // components: { Subtask },
  data() {
    return {
      editing: null,
    };
  },
  methods: {
    destroyTodo(task) {
      this.$store.dispatch('todos/destroyTodo', task);
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
  },
  computed: {
    todos() {
      return this.$store.state.todos.todos;
    },
  },
};
</script>
