import axios from "axios";

// Backend server configuration
const API_URL = "http://localhost:3001"; // Backend API URL
const WS_URL = "ws://localhost:3001"; // WebSocket URL

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth interceptor to include token in all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication functions
export const login = async (username, password) => {
  const response = await api.post("/api/v1/auth/login", { username, password });
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post("/api/v1/auth/register", userData);
  return response.data;
};

// Agent-related functions
export const getAgents = async () => {
  const response = await api.get("/api/agents");
  return response.data.agents;
};

export const getAgentById = async (agentId) => {
  const response = await api.get(`/api/agents/${agentId}`);
  return response.data;
};

export const startAgent = async (characterData) => {
  const response = await api.post("/api/agent/start", characterData);
  return response.data;
};

export const stopAgent = async (agentId) => {
  const response = await api.post(`/api/agents/${agentId}/stop`);
  return response.data;
};

export const updateAgent = async (agentId, characterData) => {
  const response = await api.post(`/api/agents/${agentId}/set`, characterData);
  return response.data;
};

// Room and message functions
export const getRooms = async () => {
  const response = await api.get("/api/v1/rooms");
  return response.data;
};

export const createRoom = async (name) => {
  const response = await api.post("/api/v1/rooms", { name });
  return response.data;
};

export const getMessages = async (roomId) => {
  const response = await api.get(`/api/v1/rooms/${roomId}/messages`);
  return response.data;
};

export const sendMessage = async (roomId, text) => {
  const response = await api.post("/api/v1/messages", { roomId, text });
  return response.data;
};

export const getMemories = async (agentId, roomId) => {
  const response = await api.get(`/api/agents/${agentId}/${roomId}/memories`);
  return response.data;
};

// Plugin-related functions
export const getPlugins = async () => {
  const response = await api.get("/api/v1/plugins");
  return response.data;
};

export const executePluginAction = async (pluginId, actionId, params) => {
  const response = await api.post(
    `/api/v1/plugins/${pluginId}/actions/${actionId}`,
    params
  );
  return response.data;
};

// Storage functions
export const getStorageFiles = async () => {
  const response = await api.get("/api/storage");
  return response.data.files;
};

// Export configuration constants
export { API_URL, WS_URL };

// Export the api instance
export default api;
