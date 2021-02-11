export default {
  state: {
    todos: [
      {
        text: 'Do this',
        isDone: true,
        id: 1,
        subtasks: [
          { text: 'this for this', isDone: true, id: 1 },
          { text: 'that for this', isDone: true, id: 2 },
        ],
      },
      {
        text: 'Do that',
        isDone: false,
        id: 2,
        subtasks: [
          { text: 'this for that', isDone: false, id: 1 },
          { text: 'that for that', isDone: true, id: 2 },
          { text: 'those for that', isDone: false, id: 3 },
        ],
      },
      {
        text: 'Do those',
        isDone: false,
        id: 3,
        subtasks: [
          { text: 'this for those', isDone: false, id: 1 },
          { text: 'that for those', isDone: false, id: 2 },
          { text: 'those for those', isDone: false, id: 3 },
          { text: 'these for those', isDone: true, id: 4 },
        ],
      },
    ],
  },
  mutations: {
    addTodo(state, todo) {
      state.todos.push(todo);
    },
    setTodos(state, todos) {
      state.todos = todos;
    },
    removeTodo(state, index) {
      state.todos.splice(index, 1);
    },
  },
  actions: {
    clearCompleted(context) {
      context.commit('setTodos', context.state.todos.filter((todo) => !todo.isDone));
    },
    destroyTodo(context, todo) {
      const index = context.state.todos.indexOf(todo);
      context.commit('removeTodo', index);
    },
    createTodo(context, todo) {
      context.commit('addTodo', todo);
    },
  },
  getters: {
    activeTodos(state) {
      // console.log(state.todos);
      return state.todos.filter((todo) => !todo.isDone);
    },
    completedTodos(state) {
      return state.todos.filter((todo) => todo.isDone);
    },
  },
};
