import { useState } from "react";
import {
  FaBars,
  FaHome,
  FaSignInAlt,
  FaUserAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { Transition } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import { RootState } from "../app/store";

export default function Navbar() {
  const { data: user } = useSelector((state: RootState) => state.auth);

  const [showDropdown, setShowDropDown] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleDropdown = () => {
    setShowDropDown((prev) => !prev);
  };

  const handleLogout = () => {
    try {
      if (window.confirm("Are you sure, you want to logout?")) {
        dispatch(logout());
        window.localStorage.removeItem("token");
        navigate("/");
        toast.success("Logout successful");
      }
    } catch (error) {
      toast.error((error as string) ?? "An error occured!");
    }
  };

  return (
    <nav className="w-full fixed top-0">
      <div className="flex justify-between border-2 py-5 sm:px-12 px-5 bg-white">
        <Link to="/" className="flex justify-center items-center">
          <span className="w-full italic text-blue-500 font-bold sm:text-3xl text-2xl">
            Das Gehirn Inc.
          </span>
        </Link>
        {user ? (
          <div className="hidden md:block">
            <div className="flex items-center sm:gap-8 gap-2 text-white text-sm sm:text-lg">
              <span className="flex gap-2 sm:py-1.5 sm:px-4 py-0.5 px-2 rounded-md font-bold text-blue-500">
                <FaUserAlt className="sm:size-7 size-5 text-blue-500" />
                {user.name ?? ""}
              </span>
              <button
                onClick={handleLogout}
                className="flex gap-2 sm:py-1.5 sm:px-4 py-0.5 px-2 rounded-md bg-blue-500 font-bold"
              >
                <FaSignOutAlt className="sm:size-7 size-5" />
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
        {user && user ? (
          <div className="md:hidden block relative">
            <div>
              <button
                onClick={handleDropdown}
                className=" bg-blue-500 p-3 rounded-md border border-black/10"
                type="button"
              >
                <FaBars className=" text-white size-4" />
              </button>
            </div>
            <Transition
              show={showDropdown}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="otransform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <div className="absolute transition ease-out duration-100 right-0 z-10 mt-1 w-56 origin-top-right rounded-md bg-white shadow-lg ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <button className="flex gap-2 sm:py-1.5 sm:px-4 py-0.5 px-2 rounded-md font-bold">
                    <FaUserAlt className="size-5" />
                    {user.name ?? ""}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex gap-2 sm:py-1.5 sm:px-4 py-0.5 px-2 rounded-md font-bold"
                  >
                    <FaSignOutAlt className="size-5" />
                    Sign Out
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        ) : (
          <div className="md:hidden block relative">
            <div>
              <button
                onClick={handleDropdown}
                className=" bg-blue-500 p-3 rounded-md border border-black/10"
                type="button"
              >
                <FaBars className=" text-white size-4" />
              </button>
            </div>
            <Transition
              show={showDropdown}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="otransform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <div className="absolute transition ease-out duration-100 right-0 z-10 mt-1 w-56 origin-top-right rounded-md bg-white shadow-lg ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Link
                    to="/"
                    className="text-gray-700 block px-4 py-2 text-sm active:bg-blue-500"
                  >
                    <button className="flex gap-2 sm:py-1.5 sm:px-4 py-0.5 px-2 rounded-md font-bold">
                      <FaHome className="sm:size-7 size-5" />
                      Home
                    </button>
                  </Link>
                  <Link
                    to="/"
                    className="text-gray-700 block px-4 py-2 text-sm"
                  >
                    <button className="flex gap-2 sm:py-1.5 sm:px-4 py-0.5 px-2 rounded-md font-bold">
                      <FaSignInAlt className="sm:size-7 size-5" />
                      Login
                    </button>
                  </Link>
                </div>
              </div>
            </Transition>
          </div>
        )}
      </div>
    </nav>
  );
}
