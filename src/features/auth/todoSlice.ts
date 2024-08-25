import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";
import { ToDoData, TodoProps } from "../../interface/todos";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "../../interface/auth";

// Define the async thunk to fetch todos
export const getTodos = createAsyncThunk(
  "todos/getTodos",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/todos");
      return data.todos;
    } catch (error) {
      return rejectWithValue(
        (error as AxiosError<ApiErrorResponse>).response?.data ||
          "Error fetching todos"
      );
    }
  }
);

// Add todo
export const addTodo = createAsyncThunk(
  "todos/addTodo",
  async (
    newTodo: { id: string; text: string; isCompleted: boolean },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.post("/todos", newTodo);
      return data;
    } catch (error) {
      return rejectWithValue(
        (error as AxiosError<ApiErrorResponse>).response?.data.message ||
          "Error adding todo"
      );
    }
  }
);

// Update todo
export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async (updatedTodo: TodoProps, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/todos/${updatedTodo.id}`, updatedTodo);
      return data;
    } catch (error) {
      return rejectWithValue(
        (error as AxiosError<ApiErrorResponse>).response?.data.message ||
          "Error updating todo"
      );
    }
  }
);

// Delete todo
export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/todos/${id}`);
      return { id, message: data.message };
    } catch (error) {
      return rejectWithValue(
        (error as AxiosError<ApiErrorResponse>).response?.data.message ||
          "Error deleting todo"
      );
    }
  }
);

const initialState: ToDoData = {
  data: [],
  status: "",
  error: null,
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTodos.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getTodos.fulfilled, (state, action) => {
        state.status = "success";
        state.data = action.payload;
      })
      .addCase(getTodos.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      })
      // Handle addTodo
      .addCase(addTodo.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addTodo.fulfilled, (state) => {
        state.status = "success";
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      })

      // Handle updateTodo
      .addCase(updateTodo.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateTodo.fulfilled, (state) => {
        state.status = "success";
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      })

      // Handle deleteTodo
      .addCase(deleteTodo.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteTodo.fulfilled, (state) => {
        state.status = "success";
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      });
  },
});

export default todosSlice.reducer;
