import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { GlobalContext } from "./../context/Context";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroller";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";

import "./login.css";

function UserList() {
  let { state, dispatch } = useContext(GlobalContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socket = io(state.baseUrlSocketIo, {
      withCredentials: true,
    });

    socket.on("connect", function () {
      console.log("connected");
    });
    socket.on("disconnect", function (message) {
      console.log("Socket disconnected from server: ", message);
    });
    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    console.log("subscribed: ", `personal-channel-${state.user._id}`);

    socket.on(`personal-channel-${state.user._id}`, function (data) {
      console.log("socket push data: ", data);
      setNotifications((prev) => [...prev, data]);
    });

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async (e) => {
    if (e) e.preventDefault();

    try {
      const response = await axios.get(
        `${state.baseUrl}/users?q=${searchTerm}`
      );
      console.log("response: ", response.data);
      setUsers(response.data);
    } catch (error) {
      console.log("error in getting all tweets", error);
      // setUsers([])
    }
  };

  const dismissNotification = (notification) => {
    setNotifications((allNotifications) =>
      allNotifications.filter((eachItem) => eachItem._id !== notification._id)
    );
  };

  return (
    <div>
      <div className="notificationView">
        {notifications.map((eachNotification, index) => {
          return (
            <div key={index} className="item">
              <Link to={`/chat/${eachNotification.from._id}`}>
                <div className="title">{eachNotification.from.firstName}</div>
                <div>{eachNotification.text.slice(0, 100)}</div>
              </Link>
              <button
                onClick={() => {
                  dismissNotification(eachNotification);
                }}
              >
                dismiss
              </button>
            </div>
          );
        })}
      </div>

      <h1>Search user to start chat</h1>

      <form onSubmit={getUsers}>
        <input
          type="search"
          placeholder="type user name"
          onChange={(e) => [setSearchTerm(e.target.value)]}
        />
        <button type="submit">Search</button>
      </form>

      {users?.length
        ? users?.map((eachUser, index) => {
            return (
              <div className="userListItem" key={index}>
                <h2>{eachUser.firstName}</h2>
                <span>{eachUser.email}</span>

                {eachUser?.me ? (
                  <span>
                    <br />
                    this is me
                  </span>
                ) : null}
<br /><br />
                <button>
                  <Link to={`/chat/${eachUser._id}`}>chat with {eachUser.firstName} </Link>
                </button>
              </div>
            );
          })
        : null}
      {users?.length === 0 ? "No users found" : null}
      {users === null ? "Loading..." : null}
    </div>
  );
}

export default UserList;
