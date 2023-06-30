import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import UserCard from "../components/UserCard";
import axios from "axios";

//Definir variable de entorno
const url_api = process.env.API_URL;

export default function UsersView() {
  const [allUsers, setAllUsers] = useState(null);

  const getAllUsers = () => {
    axios
      .get(`${url_api}/user/`)
      .then((response) => {
        setAllUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div>
      {allUsers &&
        allUsers.map((user, index) => {
          return (
            <UserCard
              key={index}
              id={user._id}
              name={user.name}
              lastname={user.lastname}
              email={user.email}
              role={user.role}
            />
          );
        })}
    </div>
  );
}
