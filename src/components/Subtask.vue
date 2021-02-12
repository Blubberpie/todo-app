<template>
  <div>
    <v-text-field solo
      v-if="isCreating && (taskId === taskCreatingSubtask)"
      v-model="subtaskText"
      placeholder="What's your subtask?"
      @keyup.enter="createSubtask"
      @keyup.esc="cancelCreateSubtask"
      autofocus
      />
    <v-list
      class="sub-list"
      v-for="(subtask, subtaskId) in this.subtasks"
      v-bind:key="subtaskId"
    >
      <v-list-item>
        <v-list-item-action>
          <v-checkbox
          :input-value="subtask.isDone"
          @change="toggleSubtaskDone($event, subtaskId)"
          />
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title class="thicc task-text" v-text="subtask.text"/>
        </v-list-item-content>
        <v-btn @click="destroySubtask(subtaskId)"><v-icon>mdi-delete</v-icon></v-btn>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'Subtask',
  data() {
    return {
      subtaskText: '',
    };
  },
  props: {
    taskId: {
      type: String,
    },
    subtasks: {
      type: Object,
    },
    isCreating: {
      type: Boolean,
      default: false,
    },
    taskCreatingSubtask: {
      type: String,
      default: '',
    },
  },
  methods: {
    createSubtask() {
      const newSubtask = {
        text: this.subtaskText,
        isDone: false,
      };
      this.$emit('pushNewSubtask', this.taskCreatingSubtask, newSubtask);
      this.subtaskText = '';
    },
    cancelCreateSubtask() {
      this.$emit('cancelCreateSubtask');
    },
    destroySubtask(subtaskId) {
      this.$emit('destroySubtask', this.taskId, subtaskId);
    },
    toggleSubtaskDone(isDone, subtaskId) {
      this.$emit('toggleSubtaskDone', isDone, this.taskId, subtaskId);
    },
  },
};
</script>
