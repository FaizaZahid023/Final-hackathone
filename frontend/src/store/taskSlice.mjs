import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  taskToEdit: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    setTaskToEdit: (state, action) => {
      state.taskToEdit = action.payload;
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(task => task._id === action.payload._id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
  },
});

export const { setTasks, setTaskToEdit, updateTask } = taskSlice.actions;

export default taskSlice.reducer;
