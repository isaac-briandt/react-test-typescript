import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAppDispatch } from "./app/hooks";
import { useEffect, useState } from "react";
import axios from "./axios";
import { account } from "./features/auth/authSlice";
import LoadingSpinner from "./components/LoadingSpinner";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import { AppLayout } from "./components/AppLayout";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);

export default function App() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      dispatch(account())
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-black">
        <LoadingSpinner className="w-12 h-12 text-blue-500" />
      </div>
    );
  }

  return <RouterProvider router={router} />;
}
