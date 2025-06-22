// Note: This file requires the "socket.io-client" package
// Install with: npm install socket.io-client
// or: yarn add socket.io-client

import { io } from "socket.io-client";

// Backend WebSocket URL
const WS_URL = "ws://localhost:3001";

/**
 * Connects to the WebSocket server
 * @param {string} token - Authentication token
 * @returns {Socket} Socket.io instance
 */
export const connectSocket = (token) => {
  const socket = io(WS_URL, {
    auth: { token },
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("Socket connected");
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });

  return socket;
};

/**
 * Subscribes to a room to receive messages
 * @param {Socket} socket - Socket.io instance
 * @param {string} roomId - Room ID to join
 * @param {Function} onMessage - Callback for message events
 * @returns {Function} Unsubscribe function
 */
export const subscribeToRoom = (socket, roomId, onMessage) => {
  socket.emit("join_room", { roomId });

  const messageHandler = (message) => {
    if (message.roomId === roomId) {
      onMessage(message);
    }
  };

  socket.on("message", messageHandler);

  // Return unsubscribe function
  return () => {
    socket.off("message", messageHandler);
    socket.emit("leave_room", { roomId });
  };
};

/**
 * Subscribes to typing indicators
 * @param {Socket} socket - Socket.io instance
 * @param {string} roomId - Room ID to monitor
 * @param {Function} onTyping - Callback for typing events
 * @returns {Function} Unsubscribe function
 */
export const subscribeToTyping = (socket, roomId, onTyping) => {
  const typingHandler = (data) => {
    if (data.roomId === roomId) {
      onTyping(data);
    }
  };

  socket.on("typing", typingHandler);

  // Return unsubscribe function
  return () => {
    socket.off("typing", typingHandler);
  };
};

/**
 * Emits typing status to the server
 * @param {Socket} socket - Socket.io instance
 * @param {string} roomId - Room ID
 * @param {boolean} isTyping - Whether user is typing
 */
export const emitTypingStatus = (socket, roomId, isTyping) => {
  socket.emit("typing", { roomId, isTyping });
};

/**
 * Subscribes to agent status updates
 * @param {Socket} socket - Socket.io instance
 * @param {string} agentId - Agent ID to monitor
 * @param {Function} onStatusChange - Callback for status events
 * @returns {Function} Unsubscribe function
 */
export const subscribeToAgentStatus = (socket, agentId, onStatusChange) => {
  const statusHandler = (data) => {
    if (data.agentId === agentId) {
      onStatusChange(data);
    }
  };

  socket.on("agent_status", statusHandler);

  // Return unsubscribe function
  return () => {
    socket.off("agent_status", statusHandler);
  };
};

export default {
  connectSocket,
  subscribeToRoom,
  subscribeToTyping,
  emitTypingStatus,
  subscribeToAgentStatus,
  WS_URL,
};
