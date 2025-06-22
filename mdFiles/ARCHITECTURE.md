# ElizaOS System Architecture

This document provides a detailed overview of the ElizaOS system architecture, including the core components, data flow, plugin system, and technical implementation details.

## Table of Contents

-   [System Overview](#system-overview)
-   [Core Components](#core-components)
-   [Data Flow](#data-flow)
-   [Plugin System](#plugin-system)
-   [Database Schema](#database-schema)
-   [AI Integration](#ai-integration)
-   [Security Model](#security-model)
-   [Scalability Considerations](#scalability-considerations)

## System Overview

ElizaOS is an AI agent platform built with a modular architecture that separates concerns between the backend agent system and the frontend client interface. The system is designed to be extensible through plugins and adaptable to different AI models and providers.

### High-Level Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                      Frontend Client                          │
└───────────────┬─────────────────────────────┬─────────────────┘
                │                             │
                ▼                             ▼
┌───────────────────────────┐     ┌─────────────────────────────┐
│       REST API Layer      │     │     WebSocket Server        │
└───────────────┬───────────┘     └─────────────┬───────────────┘
                │                               │
                ▼                               ▼
┌───────────────────────────────────────────────────────────────┐
│                        Agent Runtime                          │
├───────────────┬───────────────┬───────────────┬───────────────┤
│  Memory Mgr   │  Plugin Mgr   │  Knowledge    │  Service Mgr  │
└───────────────┴───────┬───────┴───────────────┴───────────────┘
                        │
            ┌───────────┴───────────┐
            ▼                       ▼
┌─────────────────────┐   ┌──────────────────────┐
│  Model Providers    │   │  Plugin Instances    │
│  (OpenAI, etc.)     │   │  (Twitter, etc.)     │
└─────────────────────┘   └──────────────────────┘
```

## Core Components

### 1. Agent Runtime

The Agent Runtime is the central component that orchestrates all operations within the system:

-   **Initialization**: Loads character configuration, plugins, and establishes database connections
-   **Message Processing**: Routes user messages through the AI model and plugins
-   **State Management**: Maintains conversation context and agent state
-   **Service Coordination**: Manages service lifecycle and dependencies

```typescript
// Simplified Agent Runtime initialization
export class AgentRuntime implements IAgentRuntime {
    constructor(options: AgentRuntimeOptions) {
        this.agentId = options.agentId || uuidv4();
        this.character = options.character;
        this.modelProvider =
            options.modelProvider || this.character.modelProvider;
        this.plugins = [];
        this.actions = [];
        this.evaluators = [];
        this.providers = [];
        this.clients = [];
        this.services = new Map();
    }

    async initialize(): Promise<void> {
        // Initialize database
        await this.initializeDatabase();

        // Register memory managers
        this.messageManager = new MemoryManager(this, "messages");
        this.knowledgeManager = new MemoryManager(this, "knowledge");

        // Initialize plugins
        await this.initializePlugins();

        // Initialize services
        await this.initializeServices();
    }
}
```

### 2. Memory Manager

The Memory Manager handles persistent storage and retrieval of conversation data:

-   **Message Storage**: Saves conversation messages to database
-   **Embedding Generation**: Creates vector embeddings for semantic search
-   **Retrieval**: Fetches relevant context based on similarity search

### 3. Plugin Manager

The Plugin Manager handles plugin registration, lifecycle, and execution:

-   **Plugin Loading**: Dynamically loads plugins at runtime
-   **Action Registration**: Registers plugin-provided actions
-   **Execution**: Routes action requests to appropriate plugins

### 4. Knowledge Manager

The Knowledge Manager handles the agent's knowledge base:

-   **Document Processing**: Chunks and embeds documents
-   **Semantic Search**: Retrieves relevant knowledge based on queries
-   **RAG Integration**: Integrates retrieved knowledge into AI prompts

### 5. Service Manager

The Service Manager handles system-level services:

-   **Service Registration**: Registers and manages services
-   **Dependency Resolution**: Handles service dependencies
-   **Lifecycle Management**: Controls service startup and shutdown

## Data Flow

### Message Processing Flow

1. **User Message Reception**:

    - Frontend sends message to backend API
    - Message is validated and stored in database
    - WebSocket notification is sent to connected clients

2. **Agent Processing**:

    - Message is processed by the agent runtime
    - Relevant context is retrieved from memory
    - Plugins are invoked for pre-processing

3. **AI Model Invocation**:

    - Context and message are sent to AI model provider
    - Model generates a response
    - Response is parsed and processed

4. **Response Handling**:
    - Response is stored in database
    - Plugins are invoked for post-processing
    - WebSocket notification is sent to connected clients

```sequence
User->Frontend: Send message
Frontend->Backend API: POST /api/v1/messages
Backend API->Database: Store message
Backend API->Agent Runtime: Process message
Agent Runtime->Memory Manager: Retrieve context
Agent Runtime->Plugin Manager: Pre-process message
Agent Runtime->AI Model: Generate response
AI Model->Agent Runtime: Return response
Agent Runtime->Plugin Manager: Post-process response
Agent Runtime->Database: Store response
Agent Runtime->WebSocket: Broadcast response
WebSocket->Frontend: Receive response
Frontend->User: Display response
```

## Plugin System

The plugin system allows for extending the agent's capabilities through modular components:

### Plugin Interface

```typescript
export interface Plugin {
    name: string;
    version: string;
    description: string;
    config?: Record<string, any>;
    actions?: Action[];
    providers?: Provider[];
    evaluators?: Evaluator[];
    services?: Service[];
    clients?: Client[];
    adapters?: Adapter[];
}
```

### Plugin Types

1. **Action Plugins**: Provide new actions the agent can perform
2. **Provider Plugins**: Supply data or services to the agent
3. **Evaluator Plugins**: Evaluate agent responses or user inputs
4. **Service Plugins**: Provide system-level services
5. **Client Plugins**: Connect to external systems or APIs

### Plugin Registration

Plugins are registered with the agent runtime during initialization:

```typescript
async initializePlugins(): Promise<void> {
  for (const plugin of this.character.plugins) {
    // Register plugin actions
    if (plugin.actions) {
      for (const action of plugin.actions) {
        this.registerAction(action);
      }
    }

    // Register plugin providers
    if (plugin.providers) {
      this.providers = [...this.providers, ...plugin.providers];
    }

    // Register plugin services
    if (plugin.services) {
      for (const service of plugin.services) {
        this.registerService(service);
      }
    }

    // Register plugin clients
    if (plugin.clients) {
      for (const client of plugin.clients) {
        await this.registerClient(client);
      }
    }
  }
}
```

## Database Schema

ElizaOS uses SQLite for data storage with the following key tables:

### Memory Tables

1. **messages**: Stores conversation messages

    - `id`: UUID primary key
    - `userId`: User identifier
    - `agentId`: Agent identifier
    - `roomId`: Room identifier
    - `content`: JSON message content
    - `embedding`: Vector embedding for semantic search
    - `createdAt`: Timestamp

2. **knowledge**: Stores knowledge base items
    - `id`: UUID primary key
    - `agentId`: Agent identifier
    - `content`: JSON content
    - `embedding`: Vector embedding
    - `createdAt`: Timestamp

### Relationship Tables

1. **rooms**: Stores conversation rooms

    - `id`: UUID primary key
    - `name`: Room name
    - `createdAt`: Timestamp

2. **participants**: Stores room participants

    - `roomId`: Room identifier
    - `userId`: User identifier
    - `state`: Participation state

3. **accounts**: Stores user accounts
    - `id`: UUID primary key
    - `username`: Username
    - `name`: Display name
    - `details`: JSON additional details

## AI Integration

ElizaOS supports multiple AI model providers through a provider abstraction:

### Model Provider Interface

```typescript
export interface ModelProvider {
    generateText(prompt: string, options: ModelOptions): Promise<string>;
    generateEmbedding(text: string): Promise<number[]>;
}
```

### Supported Providers

-   **OpenAI**: GPT-3.5, GPT-4
-   **OpenRouter**: Various models
-   **Anthropic**: Claude models
-   **Local**: Local models through Ollama

### Prompt Construction

Prompts are constructed dynamically based on:

1. Character configuration
2. Conversation history
3. Retrieved knowledge
4. Plugin-provided context

```typescript
async constructPrompt(message: Memory, state: State): Promise<string> {
  // Get character system prompt
  const systemPrompt = this.character.system;

  // Get conversation history
  const history = await this.getConversationHistory(message.roomId);

  // Get relevant knowledge
  const knowledge = await this.knowledgeManager.searchRelevantKnowledge(message.content.text);

  // Combine components
  return `
    ${systemPrompt}

    ### Conversation History:
    ${formatConversation(history)}

    ### Relevant Knowledge:
    ${formatKnowledge(knowledge)}

    ### Current Message:
    ${message.content.text}
  `;
}
```

## Security Model

ElizaOS implements several security measures:

### Authentication

-   **JWT-based Authentication**: Secure token-based authentication
-   **Token Expiration**: Automatic token expiration and refresh
-   **Role-based Access**: Different access levels for different users

### Data Protection

-   **Input Validation**: Validation of all user inputs
-   **Output Sanitization**: Sanitization of AI-generated outputs
-   **Data Encryption**: Encryption of sensitive data

### Plugin Security

-   **Plugin Isolation**: Plugins run in isolated contexts
-   **Permission System**: Plugins request specific permissions
-   **Resource Limits**: Limits on plugin resource usage

## Scalability Considerations

ElizaOS is designed with scalability in mind:

### Horizontal Scaling

-   **Stateless API**: API layer can be horizontally scaled
-   **Database Sharding**: Data can be sharded by agent or user
-   **Load Balancing**: Requests can be load-balanced across instances

### Performance Optimization

-   **Caching**: Caching of frequently accessed data
-   **Batch Processing**: Batch processing of embeddings and other operations
-   **Asynchronous Processing**: Non-blocking asynchronous operations

### Resource Management

-   **Memory Limits**: Limits on memory usage per agent
-   **Rate Limiting**: Rate limiting of API requests
-   **Graceful Degradation**: Fallback mechanisms for high load scenarios

## Conclusion

The ElizaOS architecture provides a flexible and extensible framework for building AI agent applications. Its modular design allows for easy customization and extension through plugins, while the core components provide a solid foundation for AI-powered conversations and knowledge management.
