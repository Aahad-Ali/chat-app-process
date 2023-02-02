import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { GlobalContext } from "./../context/Context";
import moment from "moment";

function Home() {
  const [searchTerm, setSearchTerm] = useState([]);
  const [users, setUsers] = useState([]);

  let { state, dispatch } = useContext(GlobalContext);

  useEffect(() => {}, []);

  const getUsers =async()=>{

    try {
      const response = await axios.get(`${state.baseUrl}/users?q=${searchTerm}`)
      console.log("response: ", response.data);

      if (response.data.data.length === 0) setEof(true);



      setTweets((prev) => {

          // if (prev.length >= 10) {
          //     prev = prev.slice(5)
          // }
          return [...prev, ...response.data.data]
      })

  } catch (error) {
      console.log("error in getting all tweets", error);
  }

  }

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

      {users.map((eachUser, index) => {
        <div key={index}>
          <h2>
            {eachUser.firstName}${eachUser.lastName}
          </h2>
          <span>{eachUser.email}</span>
        </div>;
      })}
    </div>
  );
}

export default Home;
