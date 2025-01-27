// frontend/src/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  withCredentials: true, // send cookies when using the client
});

export default socket;
