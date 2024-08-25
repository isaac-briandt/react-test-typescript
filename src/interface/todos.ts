import { ApiErrorResponse } from "./auth";

export interface TodoProps {
  id: string;
  text: string;
  isCompleted: boolean;
}

export interface ToDoData {
    data: TodoProps[] | null;
    status: string;
    error: ApiErrorResponse | unknown;
  }