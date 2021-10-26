import React, { useContext, useState } from "react";

import { useAuth } from "./AuthContext";
import ChatService from "../services/ChatService";

const ChatsContext = React.createContext();

export function useChats() {
  return useContext(ChatsContext);
}

export default function ChatsProvider({ children }) {
  const { currentUser } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(false);

  const [start, setStart] = useState(0);

  const getChats = async (start, howMany) => {
    const chats = await ChatService.getChats(start, howMany);
    setChats(chats);
    return chats;
  };

  const getAllChats =  () =>{
    return getChats(0, chats.length);
  }

  const getChatRoom = async (chat, start, howMany) => {
    const messages = await ChatService.getMessages(chat, start, howMany);
    setSelectedChat((prev) => ({
      chat,
      messages:
        prev && prev.messages && prev.chat.id === chat.id
          ? [...messages, ...prev.messages]
          : messages,
    }));
    setLoading(false);
    return messages;
  };

  const addMessage = (room, message) => {
    updateLastMessage(message);    
    room && room.messages && addMessageToRoom(room, message);
  };

  const deleteMessage = async (id, room) => {
    await getAllChats()
    const updatedMessages = ChatService.deleteMessageFromRoom(id, room);
    updateLastMessage &&
      setSelectedChat({ ...room, messages: updatedMessages });
  };

  const setEditedMessage = async (message, room) => {
    await getAllChats()
    const updatedMessage = ChatService.setEditedMessage(message, room);
    updateLastMessage && setSelectedChat({ ...room, messages: updatedMessage });
  };

  const getChatMessagesCount = (chat) => {
    return ChatService.getChatMessagesCount(chat);
  };

  function updateLastMessage(message) {
    const updatedChats = ChatService.updateLastMessage(chats, message);
    setChats(updatedChats);
  }

  function addMessageToRoom(room, message) {
    if (room && room.chat.id === message.room) {
      const updatedMessages = ChatService.addMessageToRoom(
        room,
        message,
        currentUser.email
      );
      setSelectedChat({ ...room, messages: updatedMessages });
    }
  }

  const value = {
    chats,
    selectedChat,
    setSelectedChat,
    loading,
    setLoading,
    start,
    setStart,
    getChats,
    getChatRoom,
    addMessage,
    deleteMessage,
    getChatMessagesCount,
    setEditedMessage,
    getAllChats,
  };

  return (
    <ChatsContext.Provider value={value}>{children}</ChatsContext.Provider>
  );
}
