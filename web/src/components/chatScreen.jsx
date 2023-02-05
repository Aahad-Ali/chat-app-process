import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { GlobalContext } from "../context/Context";
import moment from "moment";
import { useParams } from "react-router-dom";



function ChatScreen() {
  const [writeMessage, setWriteMessage] = useState('');
  const [users, setUsers] = useState([]);

  let { state, dispatch } = useContext(GlobalContext);

  const {id} = useParams()

  useEffect(() => {
    sendMessage()
  }, []);

  const sendMessage = async (e) => {
    if(e)e.preventDefault()
    try {
      const response = await axios.get(
        `${state.baseUrl}/message`,{
          to: id,
          text:writeMessage
        }
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
      <h1>chat Screen</h1>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="type your message"
          onChange={(e) => [setWriteMessage(e.target.value)]}
        />
        <button type="submit">Search</button>
      </form>

      {users.map((eachUser, index) => (
        <div key={index}>
          <h2>
            {eachUser.firstName}
          </h2>
          <span>{eachUser.email}</span>
        </div>
      ))}
      {(users.length === 0? 'No User Found':null)}
      {(users === null ? 'Loading...':null)}

    </div>
  );
}

export default ChatScreen;
