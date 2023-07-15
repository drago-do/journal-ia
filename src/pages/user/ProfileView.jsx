import React from "react";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Button } from "@mui/material";

export default function ProfileView() {
  const [email, setEmail] = useState(null);
  const [role, setRole] = useState(null);
  const [roleColor, setRoleColor] = useState(null);
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    setEmail(Cookies.get("email"));
    setRole(Cookies.get("role"));
    setRoleColor(getRoleColor(Cookies.get("role")));
  }, []);

  function getRoleColor(role) {
    switch (role) {
      case "admin":
        return "bg-blue-500 text-white p-2";
      case "author":
        return "bg-green-500 text-white p-2";
      case "revisor":
        return "bg-orange-500 text-white p-2";
      default:
        return "";
    }
  }

  const handleLogoutClick = () => {
    //Delete all cookies of user and return to main page
    Cookies.remove("id_user");
    Cookies.remove("name");
    Cookies.remove("lastname");
    Cookies.remove("email");
    Cookies.remove("role");
    window.location.href = "/";
  };

  return (
    <div className="w-full flex justify-center">
      <div className="container flex flex-col w-10/12 pt-5">
        <h4 className="font-semibold text-xl pb-5">Información de la cuenta</h4>
        <p>
          Correo electrónico: <span className="italic">{email}</span>
        </p>
        <p className="mt-2">
          Privilegios:{" "}
          <span className={`${roleColor} rounded-md ml-3`}>{role}</span>
        </p>
        <Button
          className="mt-10"
          variant="outlined"
          color="error"
          onClick={handleLogoutClick}
        >
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
