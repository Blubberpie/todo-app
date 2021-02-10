export default {
  state: {
    todos: [
      { text: 'Do this', isDone: true, id: 1 },
      { text: 'Do that', isDone: false, id: 2 },
      { text: 'Do those', isDone: false, id: 3 },
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
