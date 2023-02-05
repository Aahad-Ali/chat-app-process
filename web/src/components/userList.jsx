import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { GlobalContext } from "./../context/Context";
import moment from "moment";
import { Link } from "react-router-dom";
import './login.css';

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);

  let { state, dispatch } = useContext(GlobalContext);

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
      console.log("error in getting all users", error);
      // setUsers([]);
    }
  };

  return (
    <div>
      <h1>search user for chat</h1>
      <form onSubmit={getUsers}>
        <input
          type="search"
          onChange={(e) => [setSearchTerm(e.target.value)]}
        />
        <button type="submit">Search</button>
      </form>

      {users.map((eachUser, index) => (
        <div key={index} className='display-user'>
          
            <h2>
              {eachUser.firstName}
            </h2>
            <span>{eachUser.email}</span><br /><br />
            <button><Link to={`/chat/${eachUser._id}`}>Chat with  {eachUser.firstName}</Link></button>
        </div>
      ))}
      {users.length === 0 ? "No User Found" : null}
      {users === null ? "Loading..." : null}
    </div>
  );
}

export default Home;
