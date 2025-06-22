# ElizaOS Frontend-Backend Integration Guide

This document provides a comprehensive guide on how to integrate the frontend client with the ElizaOS backend agent system. It covers the architecture, communication flow, API endpoints, authentication, and best practices for integration.

## Table of Contents

-   [System Architecture](#system-architecture)
-   [Communication Flow](#communication-flow)
-   [Backend API Endpoints](#backend-api-endpoints)
-   [Authentication](#authentication)
-   [Frontend Integration](#frontend-integration)
-   [WebSocket Communication](#websocket-communication)
-   [Plugin Integration](#plugin-integration)
-   [Troubleshooting](#troubleshooting)
-   [Best Practices](#best-practices)

## System Architecture

ElizaOS follows a client-server architecture with the following main components:

1. **Backend Agent System**: Node.js-based server running on port 3000/3001

    - Core Agent: Handles AI processing, plugin management, and business logic
    - Database: SQLite for storing conversations, memories, and user data
    - Plugin System: Extensible architecture for additional functionality (Twitter, Web Search, etc.)

2. **Frontend Client**: React-based web application
    - Built with Vite, TypeScript, and Tailwind CSS
    - Communicates with the backend via REST API and WebSockets
    - Provides UI for user interactions with the AI agent

```
┌──────────────┐      REST API       ┌──────────────┐
│              │◄─────────────────►  │              │
│   Frontend   │                     │   Backend    │
│    Client    │◄─────────────────►  │    Agent     │
│              │     WebSockets      │              │
└──────────────┘                     └──────────────┘
```

## Communication Flow

The communication between frontend and backend follows this general flow:

1. **Initialization**:

    - Frontend connects to backend API
    - Backend authenticates the frontend request
    - Session is established

2. **Conversation Flow**:

    - User sends a message via frontend
    - Message is transmitted to backend via API
    - Backend processes the message through the AI agent
    - Response is generated and sent back to frontend
    - Frontend displays the response to the user

3. **Real-time Updates**:
    - WebSocket connection provides real-time updates
    - Agent state changes are pushed to frontend
    - Typing indicators and partial responses are streamed

## Backend API Endpoints

The backend exposes several REST API endpoints for communication:

### Core Endpoints

| Endpoint                         | Method | Description                 | Request Body                       | Response                              |
| -------------------------------- | ------ | --------------------------- | ---------------------------------- | ------------------------------------- |
| `/api/v1/messages`               | POST   | Send a message to the agent | `{ text: string, roomId: string }` | `{ id: string, text: string, ... }`   |
| `/api/v1/rooms`                  | GET    | Get all available rooms     | -                                  | `[{ id: string, name: string, ... }]` |
| `/api/v1/rooms`                  | POST   | Create a new room           | `{ name: string }`                 | `{ id: string, name: string, ... }`   |
| `/api/v1/rooms/:roomId/messages` | GET    | Get messages for a room     | -                                  | `[{ id: string, text: string, ... }]` |

### Authentication Endpoints

| Endpoint                | Method | Description       | Request Body                                  | Response                         |
| ----------------------- | ------ | ----------------- | --------------------------------------------- | -------------------------------- |
| `/api/v1/auth/login`    | POST   | Authenticate user | `{ username: string, password: string }`      | `{ token: string, user: {...} }` |
| `/api/v1/auth/register` | POST   | Register new user | `{ username: string, password: string, ... }` | `{ token: string, user: {...} }` |

### Plugin-specific Endpoints

| Endpoint                                      | Method | Description           | Request Body    | Response        |
| --------------------------------------------- | ------ | --------------------- | --------------- | --------------- |
| `/api/v1/plugins/:pluginId/actions/:actionId` | POST   | Execute plugin action | Action-specific | Action-specific |

## Authentication

The system uses token-based authentication:

1. Client authenticates with username/password
2. Server returns a JWT token
3. Client includes token in subsequent requests:
    - HTTP Header: `Authorization: Bearer <token>`
    - WebSocket connection parameter

```javascript
// Authentication example
const login = async (username, password) => {
    const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    localStorage.setItem("token", data.token);
    return data;
};
```

## Frontend Integration

### Setup and Installation

1. Clone the repository
2. Install dependencies:
    ```bash
    cd client
    pnpm install
    ```
3. Configure environment variables:
    ```
    # .env file
    VITE_API_URL=http://localhost:3001
    VITE_WS_URL=ws://localhost:3001
    ```
4. Start the development server:
    ```bash
    pnpm start:client
    ```

### Core Components

The frontend is structured around these key components:

1. **MessageContainer**: Displays conversation messages
2. **MessageInput**: Allows users to type and send messages
3. **RoomList**: Shows available conversation rooms
4. **PluginUI**: Renders UI elements for active plugins

### API Integration

The frontend uses a service layer to communicate with the backend:

```typescript
// src/services/api.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add authentication interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const sendMessage = async (roomId, text) => {
    const response = await api.post("/api/v1/messages", { roomId, text });
    return response.data;
};

export const getRooms = async () => {
    const response = await api.get("/api/v1/rooms");
    return response.data;
};

export const getMessages = async (roomId) => {
    const response = await api.get(`/api/v1/rooms/${roomId}/messages`);
    return response.data;
};
```

## WebSocket Communication

Real-time communication is handled via WebSockets:

```typescript
// src/services/socket.ts
import { io } from "socket.io-client";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3001";

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

    return socket;
};

export const subscribeToRoom = (socket, roomId, onMessage) => {
    socket.emit("join_room", { roomId });

    socket.on("message", (message) => {
        if (message.roomId === roomId) {
            onMessage(message);
        }
    });

    return () => {
        socket.off("message");
        socket.emit("leave_room", { roomId });
    };
};
```

### Message Flow

1. User sends a message through the UI
2. Frontend sends the message to the backend API
3. Backend processes the message and sends a response
4. WebSocket pushes updates to the frontend in real-time
5. Frontend updates the UI with the response

## Plugin Integration

Plugins extend the functionality of the agent system. The frontend needs to handle plugin-specific UI and interactions:

```typescript
// src/hooks/usePlugins.ts
import { useState, useEffect } from "react";
import api from "../services/api";

export const usePlugins = () => {
    const [plugins, setPlugins] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlugins = async () => {
            try {
                const response = await api.get("/api/v1/plugins");
                setPlugins(response.data);
            } catch (error) {
                console.error("Failed to fetch plugins:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlugins();
    }, []);

    const executePluginAction = async (pluginId, actionId, params) => {
        try {
            const response = await api.post(
                `/api/v1/plugins/${pluginId}/actions/${actionId}`,
                params
            );
            return response.data;
        } catch (error) {
            console.error(
                `Failed to execute plugin action ${actionId}:`,
                error
            );
            throw error;
        }
    };

    return { plugins, loading, executePluginAction };
};
```

## Troubleshooting

### Common Issues and Solutions

1. **Connection Issues**

    - Check if backend server is running
    - Verify API URL and port configuration
    - Check browser console for CORS errors

2. **Authentication Problems**

    - Ensure token is properly stored and included in requests
    - Check token expiration
    - Verify user credentials

3. **WebSocket Connection Failures**

    - Check WebSocket URL configuration
    - Ensure WebSocket server is running
    - Verify network connectivity

4. **Plugin Integration Issues**
    - Check if plugin is properly registered in backend
    - Verify plugin configuration
    - Check for plugin-specific error messages

### Debugging Tools

-   Browser DevTools for frontend debugging
-   Backend logs for server-side issues
-   WebSocket inspection tools

## Best Practices

1. **Error Handling**

    - Implement proper error handling on both frontend and backend
    - Display user-friendly error messages
    - Log detailed errors for debugging

2. **State Management**

    - Use a state management library (Redux, Zustand, etc.)
    - Keep UI state synchronized with backend state
    - Implement optimistic updates for better UX

3. **Performance Optimization**

    - Implement pagination for message history
    - Use virtualized lists for large message sets
    - Optimize WebSocket message handling

4. **Security**

    - Validate all user inputs
    - Implement proper authentication and authorization
    - Protect sensitive data

5. **Testing**
    - Write unit tests for frontend components
    - Test API integration with mock services
    - Perform end-to-end testing for critical flows

## Conclusion

This integration guide provides a comprehensive overview of how to connect the frontend client with the ElizaOS backend agent system. By following these guidelines, you can create a robust and efficient integration that leverages the full capabilities of the agent system.

For more detailed information, refer to the API documentation and component-specific guides in the project repository.
