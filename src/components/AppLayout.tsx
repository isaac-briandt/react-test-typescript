import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "../components/Footer";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

export const AppLayout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = window.localStorage.getItem("token");

    // If token exists, redirect the user to the dashboard
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};
