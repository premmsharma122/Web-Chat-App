import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import axios from "axios";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket } = useContext(AuthContext);

  const guestUsers = async () => {
    try {
      const { data } = await axios.get("/messages/users");
      if (data.success) {
        setUser(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  const sendMessage = async (payload) => {
    const { receiver, text, image } = payload;
    if (!receiver) return;
    try {
      const { data } = await axios.post(`/messages/send/${receiver._id}`, { text, image });
      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const subscribeToNewMessages = () => {
    if (!socket) return;
    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.sender._id === selectedUser._id) { 
        newMessage.seen = true;
        setMessages((prev) => [...prev, newMessage]);
        axios.put(`/messages/seen/${newMessage._id}`);
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.sender._id]: prev[newMessage.sender._id] ? prev[newMessage.sender._id] + 1 : 1,
        }));
      }
    });
  };

  const unsubscribeFromNewMessages = () => {
    if (socket) {
      socket.off("newMessage");
    }
  };

  useEffect(() => {
    subscribeToNewMessages();
    return () => {
      unsubscribeFromNewMessages();
    };
  }, [socket, selectedUser]);

  const value = {
    messages,
    user,
    selectedUser, 
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    guestUsers,
    getMessages,
    sendMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};