// lib/socket.js
import { io } from 'socket.io-client';

let socket;

if (typeof window !== 'undefined') {
  socket = io('http://localhost:3001'); // or your server URL
}

export default socket;
