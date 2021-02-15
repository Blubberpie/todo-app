<template>
  <div>
    <v-text-field solo
      class="subtask-create"
      v-if="isCreating && (taskId === taskCreatingSubtask)"
      v-model="subtaskText"
      placeholder="What's your subtask?"
      autofocus
      append-icon="mdi-close"
      @keyup.enter="createSubtask"
      @keyup.esc="cancelCreateSubtask"
      @click:append="cancelCreateSubtask"
      />
    <div v-if="showSubtasks && (taskId === taskTogglingSubtasks)">
      <v-list
        class="sub-list transparent"
        v-for="(subtask, subtaskId) in this.subtasks"
        v-bind:key="subtaskId"
      >
        <v-card :class="subtask.isDone ? 'task-card-completed' : 'task-card'">
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
            <v-btn
              icon
              large
              color="red lighten-2"
              @click="destroySubtask(subtaskId)"><v-icon>mdi-delete</v-icon></v-btn>
          </v-list-item>
        </v-card>
      </v-list>
    </div>
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
    showSubtasks: {
      type: Boolean,
      default: true,
    },
    taskTogglingSubtasks: {
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
