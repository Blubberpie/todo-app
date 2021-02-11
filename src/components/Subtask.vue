<template>
  <div>
    <v-list
      class="sub-list"
      v-for="subtask in this.task.subtasks"
      v-bind:key="subtask.id"
    >
      <v-list-item>
        <v-list-item-action>
          <v-checkbox :input-value="subtask.isDone"/>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title class="thicc task-text" v-text="subtask.text"/>
        </v-list-item-content>
        <v-btn @click="destroySubtask(subtask)"><v-icon>mdi-delete</v-icon></v-btn>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'Subtask',
  props: {
    task: {
      type: Object,
    },
  },
  methods: {
    destroySubtask(subtask) {
      this.$emit('destroySubtask', this.task, subtask);
    },
  },
};
</script>
