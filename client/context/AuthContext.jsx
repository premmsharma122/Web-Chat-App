import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = "https://web-chat-app-backend-5p0b.onrender.com";
axios.defaults.baseURL = `${backendUrl}/api`;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  const checkAuth = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get("/users/check", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      console.error("CheckAuth error:", error.response?.data || error.message);
      setToken(null);
      localStorage.removeItem("token");
    }
  };

  const login = async (state, credentials) => {
    try {
      const endpoint = state.toLowerCase().replace(/\s/g, "");
      const { data } = await axios.post(`/users/${endpoint}`, credentials);
      if (data.success) {
        // Set state and local storage
        setAuthUser(data.userData); 
        setToken(data.token);
        localStorage.setItem("token", data.token);

        // Immediately set the default header for all future requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        
        connectSocket(data.userData); 
        toast.success(data.message);
        return true; 
      } else {
        toast.error(data.message);
        return false; 
      }
    } catch (error) {
      console.error("Login error:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || error.message);
      return false; 
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["Authorization"] = null;
    toast.success("Logged out successfully!");
    socket?.disconnect();
  };

  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/users/update-profile", body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("UpdateProfile error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
    });

    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  useEffect(() => {
    if (token) {
      // Set the default header on component mount if a token exists
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      checkAuth();
    }
  }, []);

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};