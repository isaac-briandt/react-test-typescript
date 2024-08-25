import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getTodos,
  updateTodo,
  addTodo,
  deleteTodo,
} from "../features/auth/todoSlice";
import { useAppDispatch } from "../app/hooks";
import { toast } from "react-toastify";
import {
  MdOutlineDelete,
  MdCheckBoxOutlineBlank,
  MdCheckBox,
} from "react-icons/md";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";
import { TiEdit } from "react-icons/ti";
import { TodoProps } from "../interface/todos";
import { RootState } from "../app/store";
import LoadingSpinner from "./LoadingSpinner";

export default function Todo() {
  const [searchValue, setSearchValue] = useState("");
  const [formData, setFormData] = useState<TodoProps>({
    text: "",
    id: "",
    isCompleted: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<null | TodoProps>(null); // State to hold the selected todo

  const dispatch = useAppDispatch();
  const { data: user } = useSelector((state: RootState) => state.auth);

  // Access the todos inside the `todos` key
  const {
    data: todos,
    status,
    error,
  } = useSelector((state: RootState) => state.todos);

  useEffect(() => {
    dispatch(getTodos());
  }, [dispatch]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.text.trim()) {
      toast.error("Input field is empty!");
      return;
    }

    if (isEditing) {
      dispatch(updateTodo(formData));
      toast.success("Todo updated successfully");
      dispatch(getTodos());
    } else {
      const newTodo = {
        ...formData,
        id: Date.now().toString(),
        isCompleted: false,
      };
      dispatch(addTodo(newTodo));
      toast.success("Todo added successfully");
      dispatch(getTodos());
    }

    setFormData({ text: "", id: "", isCompleted: false });
    setIsEditing(false);
  };

  // Handle edit
  const handleEdit = (todo: TodoProps) => {
    setFormData({
      text: todo.text,
      id: todo.id,
      isCompleted: todo.isCompleted,
    });
    setIsEditing(true);
  };

  const handleIsCompleted = (todo: TodoProps) => {
    const updatedTodo = { ...todo, isCompleted: !todo.isCompleted };
    dispatch(updateTodo(updatedTodo));
    dispatch(getTodos());
  };

  // Handle delete
  const handleDelete = (id: string) => {
    dispatch(deleteTodo(id));
    toast.success("Todo deleted successfully");
    dispatch(getTodos());
  };

  // Handle opening the details modal
  const handleViewDetails = (todo: TodoProps) => {
    setSelectedTodo(todo); // Set the selected todo to open in the modal
  };

  // Handle closing the modal
  const closeModal = () => {
    setSelectedTodo(null); // Clear the selected todo
  };

  // Show error if there is any
  if (error) {
    toast.error(error as string);
    return <div>{error as string}</div>;
  }

  return (
    <>
      <div className="flex flex-col w-full h-screen justify-center items-center mb-24">
        <h1 className="text-blue-500 mb-8">
          Manage your Todo Lists, {user?.name}
        </h1>
        <div className="w-[570px] mb-4 flex justify-center">
          <input
            className="w-full border p-2 text-lg mt-4"
            value={searchValue}
            type="text"
            placeholder="search your todo..."
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div className="border w-[570px] px-10 py-3">
          <form className="flex gap-1" onSubmit={handleSubmit}>
            <input
              type="text"
              className="w-full border p-2 text-lg"
              value={formData.text}
              onChange={(e) =>
                setFormData({ ...formData, text: e.target.value })
              }
              placeholder="enter a new todo..."
            />
            <button
              disabled={formData.text.length === 0}
              type="submit"
              className="bg-black text-lg px-2 py-1 text-white disabled:bg-black/50"
            >
              {isEditing ? "Update" : "Add"}
            </button>
          </form>

          {status === "loading" ? (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="flex flex-col mt-8 overflow-y-auto gap-5 divide-y h-72">
              {todos?.length ?? 0 > 0 ? (
                todos
                  ?.filter((items) => {
                    return searchValue.toLowerCase() === ""
                      ? items
                      : items.text
                          .toLowerCase()
                          .includes(searchValue.toLowerCase());
                  })
                  .map((todo) => (
                    <div
                      key={todo.id}
                      className="w-full flex justify-between items-center gap-10"
                    >
                      <p
                        className={`text-lg hover:cursor-pointer ${
                          todo.isCompleted && "line-through text-gray-400"
                        }`}
                        onClick={() => handleViewDetails(todo)} // Open modal with selected todo
                      >
                        {todo.text}
                      </p>

                      <div className="flex justify-center items-center gap-2">
                        <div
                          title={
                            todo.isCompleted
                              ? "Mark as not done"
                              : "Mark as done"
                          }
                          className="flex justify-center items-center text-sm text-black mr-2"
                        >
                          {todo.isCompleted ? (
                            <button onClick={() => handleIsCompleted(todo)}>
                              <MdCheckBox size={30} />
                            </button>
                          ) : (
                            <button onClick={() => handleIsCompleted(todo)}>
                              <MdCheckBoxOutlineBlank size={30} />
                            </button>
                          )}
                        </div>
                        <button
                          title="edit"
                          disabled={todo.isCompleted}
                          className="text-white mr-2"
                          onClick={() => handleEdit(todo)}
                        >
                          <TiEdit className="text-black" size={30} />
                        </button>
                        <button
                          title="delete"
                          className="text-white"
                          onClick={() => handleDelete(todo.id)}
                        >
                          <MdOutlineDelete className="text-red-500" size={30} />
                        </button>
                      </div>
                    </div>
                  ))
              ) : (
                <p>No todo list to display</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal for displaying todo details */}
      <Transition
        as="div"
        show={selectedTodo !== null}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        {selectedTodo && (
          <Dialog
            open={selectedTodo !== null}
            onClose={closeModal}
            className="relative z-50"
          >
            <div className="fixed inset-0 flex w-screen bg-black/10 items-center justify-center p-4">
              <DialogPanel className="max-w-lg space-y-4 border rounded-lg bg-white p-12 transition duration-500 ease-in-out">
                <DialogTitle className="font-bold">To-Do Details</DialogTitle>
                <p>Title: {selectedTodo.text}</p>
                <p>
                  Status:{" "}
                  {selectedTodo.isCompleted ? "Completed" : "Not Completed"}
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    className="bg-red-500 text-white py-1 px-2 rounded-lg"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </DialogPanel>
            </div>
          </Dialog>
        )}
      </Transition>
    </>
  );
}
