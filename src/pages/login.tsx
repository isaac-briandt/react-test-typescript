import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { account, login } from "../features/auth/authSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { RootState } from "../app/store";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const { data: user, status } = useSelector((state: RootState) => state.auth);

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const data = await dispatch(login(inputs));

      if (login.fulfilled.match(data)) {
        // Successful login - store token and navigate
        if (data.payload && "token" in data.payload) {
          window.localStorage.setItem("token", data.payload.token);
          toast.success("Login successful");
          navigate("/dashboard");
        }
      } else if (login.rejected.match(data)) {
        // Handle login rejection and display error message
        const errorMessage =
          data.payload || "Your credentials do not match our records";
        toast.error(errorMessage as string);
      }
    } catch (error) {
      // Catch any unexpected errors
      toast.error(
        (error as string) || "An unexpected error occurred, Try again!"
      );
    }
  };

  if (user && window.localStorage.getItem("token")) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-96 border p-8">
        <h1 className="text-center text-3xl font-semibold mb-7">Login</h1>
        <form onSubmit={handleSubmitLogin} className=" flex flex-col gap-4">
          <div>
            <input
              type="email"
              name="email"
              className="border w-full p-2 outline-blue-500"
              placeholder="Email Address"
              required
              value={inputs.email}
              onChange={handleChange}
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              min={5}
              className="border w-full p-2 outline-blue-500"
              placeholder="Password"
              required
              value={inputs.password}
              onChange={handleChange}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {showPassword ? (
                <FaEyeSlash
                  className="w-5 h-5 text-black text-opacity-25 cursor-pointer"
                  onClick={togglePassword}
                />
              ) : (
                <FaEye
                  className="w-5 h-5 text-black text-opacity-25 cursor-pointer"
                  onClick={togglePassword}
                />
              )}
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-fit flex justify-center items-center gap-2 bg-blue-500 py-1 text-white px-3 rounded disabled:bg-blue-300 disabled:cursor-not-allowed"
              disabled={status === "loading"}
            >
              {status === "loading" && <LoadingSpinner />}
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
