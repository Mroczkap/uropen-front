import React from "react";
import axios from "../api/axios";
import UserData from "../components/UserData";
import { useState, useEffect } from "react";

import "react-toastify/dist/ReactToastify.css";

const Blogs = () => {
  const [users, setUsers] = useState([]);

  function getData() {
    axios
      .get("/players", {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(`Request failed with status: ${response.status}`);
        }
        return response.data;
      })
      .then((data) => {
        setUsers(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div>
        <UserData users={users} onRefresh={getData} />
      </div>
    </>
  );
};

export default Blogs;
