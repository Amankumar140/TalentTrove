// import React, { createContext, useEffect, useState } from 'react';
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import socketIoClient from 'socket.io-client';

// export const GeneralContext = createContext();

// const GeneralContextProvider = ({children}) => {

//   const WS = 'http://localhost:6001';

//   const socket = socketIoClient(WS);



//   const navigate = useNavigate();

//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [usertype, setUsertype] = useState('');
 
  
  
  
//   const login = async () =>{
//     try{
//       const loginInputs = {email, password}
//         await axios.post('http://localhost:6001/login', loginInputs)
//         .then( async (res)=>{

//           localStorage.setItem('userId', res.data._id);
//             localStorage.setItem('usertype', res.data.usertype);
//             localStorage.setItem('username', res.data.username);
//             localStorage.setItem('email', res.data.email);
//             if(res.data.usertype === 'freelancer'){
//                 navigate('/freelancer');
//             } else if(res.data.usertype === 'client'){
//               navigate('/client');
//             } else if(res.data.usertype === 'admin'){
//                 navigate('/admin');
//             }
//           }).catch((err) =>{
//             alert("login failed!!");
//             console.log(err);
//           });
          
//         }catch(err){
//           console.log(err);
//         }
//       }
      
//   const inputs = {username, email, usertype, password};

//   const register = async () =>{
//     try{
//         await axios.post('http://localhost:6001/register', inputs)
//         .then( async (res)=>{
//             localStorage.setItem('userId', res.data._id);
//             localStorage.setItem('usertype', res.data.usertype);
//             localStorage.setItem('username', res.data.username);
//             localStorage.setItem('email', res.data.email);

//             if(res.data.usertype === 'freelancer'){
//               navigate('/freelancer');
//           } else if(res.data.usertype === 'client'){
//             navigate('/client');
//           } else if(res.data.usertype === 'admin'){
//               navigate('/admin');
//           }
 
//         }).catch((err) =>{
//             alert("registration failed!!");
//             console.log(err);
//         });
//     }catch(err){
//         console.log(err);
//     }
//   }


//   const logout = async () =>{
    
//     localStorage.clear();
//     for (let key in localStorage) {
//       if (localStorage.hasOwnProperty(key)) {
//         localStorage.removeItem(key);
//       }
//     }
    
//     navigate('/');
//   }


//   return (
//     <GeneralContext.Provider value={{socket, login, register, logout, username, setUsername, email, setEmail, password, setPassword, usertype, setUsertype}} >{children}</GeneralContext.Provider>
//   )
// }

// export default GeneralContextProvider


import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

export const GeneralContext = createContext();

const GeneralContextProvider = ({ children }) => {
  const WS = "http://localhost:6001";
  const socket = io(WS);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usertype, setUsertype] = useState("");

  useEffect(() => {
    const storedUsertype = localStorage.getItem("usertype");
    if (storedUsertype) {
      setUsertype(storedUsertype);
    }
  }, []);

  const login = async () => {
    try {
      const loginInputs = { email, password };
      const res = await axios.post("http://localhost:6001/login", loginInputs);
      localStorage.setItem("userId", res.data._id);
      localStorage.setItem("usertype", res.data.usertype);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("email", res.data.email);
      setUsertype(res.data.usertype);

      if (res.data.usertype === "freelancer") {
        navigate("/freelancer");
      } else if (res.data.usertype === "client") {
        navigate("/client");
      } else if (res.data.usertype === "admin") {
        navigate("/admin");
      }
    } catch (err) {
      alert("Login failed!!");
      console.error(err);
    }
  };

  const register = async () => {
    try {
      const res = await axios.post("http://localhost:6001/register", {
        username,
        email,
        usertype,
        password,
      });
      localStorage.setItem("userId", res.data._id);
      localStorage.setItem("usertype", res.data.usertype);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("email", res.data.email);
      setUsertype(res.data.usertype);

      if (res.data.usertype === "freelancer") {
        navigate("/freelancer");
      } else if (res.data.usertype === "client") {
        navigate("/client");
      } else if (res.data.usertype === "admin") {
        navigate("/admin");
      }
    } catch (err) {
      alert("Registration failed!!");
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUsertype("");
    navigate("/");
  };

  return (
    <GeneralContext.Provider
      value={{ socket, login, register, logout, username, setUsername, email, setEmail, password, setPassword, usertype, setUsertype }}
    >
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralContextProvider;
