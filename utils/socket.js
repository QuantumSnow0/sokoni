// utils/socket.js
import { io } from "socket.io-client";
import { api } from "./api"; // Make sure this exports your backend base URL

const socket = io(api, {
  transports: ["websocket"],
  autoConnect: true,
});

export default socket;
