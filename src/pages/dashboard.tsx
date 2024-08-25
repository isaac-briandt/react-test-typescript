import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Todo from "../components/Todo";
import { RootState } from "../app/store";

export default function Dashboard() {
  const { data: user } = useSelector((state: RootState) => state.auth);

  if (!user && !window.localStorage.getItem("token")) {
    toast.warn("You should login first!");
    return <Navigate to="/" />;
  }
  return (
    <>
      <div className="min-h-screen min-w-full text-4xl pt-24">
        <Todo />
      </div>
    </>
  );
}
