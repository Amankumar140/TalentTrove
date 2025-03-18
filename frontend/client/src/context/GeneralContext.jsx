import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

export const GeneralContext = createContext();

// ── Create a shared axios instance with auth header ──────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const GeneralContextProvider = ({ children }) => {
  const WS = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();

  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usertype, setUsertype] = useState("");

  useEffect(() => {
    const newSocket = io(WS, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    // Store socket immediately so children can attach listeners right away.
    // Socket.IO client automatically queues emits until connected.
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket server:", newSocket.id);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection failed:", err);
    });

    newSocket.on("disconnect", (reason) => {
      console.warn("Socket disconnected:", reason);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const login = async () => {
    try {
      const res = await axios.post(`${WS}/login`, { email, password });

      const { user, token } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", user._id);
      localStorage.setItem("usertype", user.usertype);
      localStorage.setItem("username", user.username);
      localStorage.setItem("email", user.email);

      navigate(
        user.usertype === "freelancer"
          ? "/freelancer"
          : user.usertype === "client"
          ? "/client"
          : user.usertype === "admin"
          ? "/admin"
          : "/"
      );
    } catch (err) {
      alert("Login failed!!");
      console.error("Login error:", err);
    }
  };

  const register = async () => {
    try {
      const res = await axios.post(`${WS}/register`, {
        username,
        email,
        usertype,
        password,
      });

      const { user, token } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", user._id);
      localStorage.setItem("usertype", user.usertype);
      localStorage.setItem("username", user.username);
      localStorage.setItem("email", user.email);

      navigate(
        user.usertype === "freelancer"
          ? "/freelancer"
          : user.usertype === "client"
          ? "/client"
          : user.usertype === "admin"
          ? "/admin"
          : "/"
      );
    } catch (err) {
      alert("Registration failed!!");
      console.error("Registration error:", err);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <GeneralContext.Provider
      value={{
        socket,
        api,
        login,
        register,
        logout,
        username,
        setUsername,
        email,
        setEmail,
        password,
        setPassword,
        usertype,
        setUsertype,
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};

export { api };
export default GeneralContextProvider;
