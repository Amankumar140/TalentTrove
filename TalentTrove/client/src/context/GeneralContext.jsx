// import React, { createContext, useEffect, useState } from 'react';
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import  {io} from 'socket.io-client';

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

// import React, { createContext, useEffect, useState } from 'react';
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { io } from 'socket.io-client';

// export const GeneralContext = createContext();

// const GeneralContextProvider = ({ children }) => {
//   const WS = 'http://localhost:6001';
//   const navigate = useNavigate();

//   const [socket, setSocket] = useState(null);
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [usertype, setUsertype] = useState('');

//   // Initialize socket connection
//   useEffect(() => {
//     const newSocket = io(WS, { transports: ['websocket', 'polling'] });

//     newSocket.on('connect', () => {
//       console.log('Connected to WebSocket server:', newSocket.id);
//     });

//     newSocket.on('disconnect', () => {
//       console.log('Disconnected from server');
//     });

//     setSocket(newSocket);

//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   // Login Function
//   const login = async () => {
//     try {
//       const loginInputs = { email, password };
//       const res = await axios.post(`${WS}/login`, loginInputs);

//       localStorage.setItem('userId', res.data._id);
//       localStorage.setItem('usertype', res.data.usertype);
//       localStorage.setItem('username', res.data.username);
//       localStorage.setItem('email', res.data.email);

//       switch (res.data.usertype) {
//         case 'freelancer':
//           navigate('/freelancer');
//           break;
//         case 'client':
//           navigate('/client');
//           break;
//         case 'admin':
//           navigate('/admin');
//           break;
//         default:
//           alert("Invalid user type");
//       }
//     } catch (err) {
//       alert("Login failed!!");
//       console.error("Login error:", err);
//     }
//   };

//   // Registration Function
//   const register = async () => {
//     try {
//       const res = await axios.post(`${WS}/register`, { username, email, usertype, password });

//       localStorage.setItem('userId', res.data._id);
//       localStorage.setItem('usertype', res.data.usertype);
//       localStorage.setItem('username', res.data.username);
//       localStorage.setItem('email', res.data.email);

//       switch (res.data.usertype) {
//         case 'freelancer':
//           navigate('/freelancer');
//           break;
//         case 'client':
//           navigate('/client');
//           break;
//         case 'admin':
//           navigate('/admin');
//           break;
//         default:
//           alert("Invalid user type");
//       }
//     } catch (err) {
//       alert("Registration failed!!");
//       console.error("Registration error:", err);
//     }
//   };

//   // Logout Function
//   const logout = () => {
//     localStorage.removeItem('userId');
//     localStorage.removeItem('usertype');
//     localStorage.removeItem('username');
//     localStorage.removeItem('email');

//     navigate('/');
//   };

//   return (
//     <GeneralContext.Provider value={{
//       socket, login, register, logout, 
//       username, setUsername, email, setEmail, 
//       password, setPassword, usertype, setUsertype
//     }}>
//       {children}
//     </GeneralContext.Provider>
//   );
// };

// export default GeneralContextProvider;


import React, { createContext, useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from 'socket.io-client';

export const GeneralContext = createContext();

const GeneralContextProvider = ({ children }) => {
  const WS = 'http://localhost:6001';
  const navigate = useNavigate();

  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('');

  useEffect(() => {
    const newSocket = io(WS, {
      transports: ['websocket', 'polling'],
      reconnection: true, // Enable auto-reconnect
      reconnectionAttempts: 5, // Try reconnecting 5 times
      reconnectionDelay: 3000, // Wait 3 seconds before reconnecting
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server:', newSocket.id);
      setSocket(newSocket);
    });

    newSocket.on('connect_error', (err) => {
      console.error("Socket connection failed:", err);
    });

    newSocket.on('disconnect', (reason) => {
      console.warn("Socket disconnected:", reason);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const login = async () => {
    try {
      const res = await axios.post(`${WS}/login`, { email, password });

      localStorage.setItem('userId', res.data._id);
      localStorage.setItem('usertype', res.data.usertype);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('email', res.data.email);

      navigate(res.data.usertype === 'freelancer' ? '/freelancer' :
               res.data.usertype === 'client' ? '/client' :
               res.data.usertype === 'admin' ? '/admin' : '/');
    } catch (err) {
      alert("Login failed!!");
      console.error("Login error:", err);
    }
  };

  const register = async () => {
    try {
      const res = await axios.post(`${WS}/register`, { username, email, usertype, password });

      localStorage.setItem('userId', res.data._id);
      localStorage.setItem('usertype', res.data.usertype);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('email', res.data.email);

      navigate(res.data.usertype === 'freelancer' ? '/freelancer' :
               res.data.usertype === 'client' ? '/client' :
               res.data.usertype === 'admin' ? '/admin' : '/');
    } catch (err) {
      alert("Registration failed!!");
      console.error("Registration error:", err);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <GeneralContext.Provider value={{
      socket, login, register, logout, 
      username, setUsername, email, setEmail, 
      password, setPassword, usertype, setUsertype
    }}>
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralContextProvider;
