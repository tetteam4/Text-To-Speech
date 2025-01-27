// backend/utils/onlineStatus.js
let onlineUsers = {};

export const setOnline = (userId) => {
  onlineUsers[userId] = true;
  console.log("set online");
};

export const setOffline = (userId) => {
  delete onlineUsers[userId];
  console.log("set offline");
};

export const getOnlineStatus = (userId) => {
  return !!onlineUsers[userId];
};

export const getOnlineUsers = () => {
  return Object.keys(onlineUsers);
};
