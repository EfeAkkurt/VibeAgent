# Creating Your First Agent with ElizaOS

This tutorial will guide you through the process of creating your first AI agent using the ElizaOS platform. By the end, you'll have a fully functional agent that can engage in conversations and perform actions.

## Prerequisites

Before you begin, make sure you have the following:

-   Node.js v23.3.0 or higher installed
-   pnpm v8.0.0 or higher installed
-   A basic understanding of TypeScript
-   An API key for an AI model provider (OpenAI, Anthropic, etc.)

## Step 1: Set Up Your Environment

First, clone the ElizaOS repository and install the dependencies:

```bash
# Clone the repository
git clone https://github.com/yourusername/elizaos.git
cd elizaos

# Install dependencies
pnpm install

# Build the packages
pnpm build
```

## Step 2: Configure Your Environment Variables

Create a `.env` file in the root directory of the project:

```bash
cp .env.example .env
```

Edit the `.env` file to add your API keys and other configuration options:

```
# Model Provider API Keys
OPENAI_API_KEY=sk-your-openai-api-key
ANTHROPIC_API_KEY=sk-your-anthropic-api-key

# Agent Configuration
DEFAULT_MODEL=gpt-4
DEFAULT_EMBEDDING_MODEL=text-embedding-3-small

# Database Configuration
DB_TYPE=sqlite
DB_PATH=./data/agent.db

# Server Configuration
SERVER_PORT=3000
CLIENT_PORT=5173
```

## Step 3: Create Your Agent Configuration

Create a new file `myagent.ts` in the `agent/src/characters` directory:

```typescript
import { Character } from "@elizaos/core";
import WebSearchPlugin from "@elizaos-plugins/plugin-web-search";
import TwitterPlugin from "@elizaos-plugins/plugin-twitter";

export const myAgent: Character = {
    name: "MyFirstAgent",
    description:
        "A helpful assistant that can search the web and post to Twitter",

    // System prompt that defines the agent's personality and behavior
    system: `You are MyFirstAgent, a helpful and friendly AI assistant.
You have access to web search capabilities and can post to Twitter.
Always be polite, helpful, and concise in your responses.
If you don't know something, use your web search capability to find information.`,

    // Model provider configuration
    modelProvider: {
        name: "openai",
        model: "gpt-4",
        temperature: 0.7,
        maxTokens: 1000,
    },

    // Plugins that extend the agent's capabilities
    plugins: [
        new WebSearchPlugin(),
        new TwitterPlugin({
            // Twitter plugin configuration (optional)
        }),
    ],

    // Memory configuration
    memory: {
        messageHistoryLimit: 20,
        useEmbeddings: true,
    },
};
```

## Step 4: Register Your Agent

Edit the `agent/src/index.ts` file to register your new agent:

```typescript
import { startAgents } from "@elizaos/core";
import { myAgent } from "./characters/myagent";

async function main() {
    try {
        await startAgents([myAgent]);
        console.log("Agents started successfully");
    } catch (error) {
        console.error("Error starting agents:", error);
        process.exit(1);
    }
}

main();
```

## Step 5: Start Your Agent

Now you can start your agent:

```bash
pnpm start
```

In a separate terminal, start the client:

```bash
pnpm start:client
```

Visit `http://localhost:5173` in your browser to interact with your agent.

## Step 6: Customize Your Agent

Now that you have a basic agent running, you can customize it to suit your needs:

### Modify the System Prompt

The system prompt defines your agent's personality and behavior. Edit the `system` field in your agent configuration to change how your agent responds:

```typescript
system: `You are MyFirstAgent, a helpful AI assistant specialized in technology and programming.
You have a friendly and professional tone, and you're always eager to help users with their technical questions.
You have access to web search capabilities to find up-to-date information.
When explaining technical concepts, you provide clear and concise explanations with examples.`,
```

### Add More Plugins

You can add more plugins to extend your agent's capabilities:

```typescript
import WeatherPlugin from '@elizaos-plugins/plugin-weather';
import MultiversXPlugin from '@elizaos-plugins/plugin-multiversx';

// ...

plugins: [
  new WebSearchPlugin(),
  new TwitterPlugin(),
  new WeatherPlugin({
    apiKey: process.env.WEATHER_API_KEY,
    units: 'metric',
  }),
  new MultiversXPlugin(),
],
```

### Configure Memory Settings

You can adjust how your agent remembers conversations:

```typescript
memory: {
  messageHistoryLimit: 50,  // Remember more messages
  useEmbeddings: true,      // Use embeddings for semantic search
  embeddingModel: 'text-embedding-3-small',  // Specify embedding model
  relevanceThreshold: 0.75, // Higher threshold for more relevant memories
},
```

## Step 7: Add Custom Actions

You can create custom actions for your agent by creating a new plugin:

1. Create a new directory for your plugin:

```bash
mkdir -p packages/plugin-custom
cd packages/plugin-custom
```

2. Set up the plugin structure:

```bash
mkdir -p src/actions
touch src/index.ts
touch src/actions/customAction.ts
touch package.json
touch tsconfig.json
touch tsup.config.ts
```

3. Create a custom action:

```typescript
// src/actions/customAction.ts
import { Action } from "@elizaos/core";

export const customAction: Action = {
    name: "customAction",
    description: "A custom action that does something special",
    parameters: {
        type: "object",
        properties: {
            input: {
                type: "string",
                description: "Input for the custom action",
            },
        },
        required: ["input"],
    },

    async execute(params, context) {
        const { input } = params;

        // Your custom logic here
        const result = `Processed: ${input.toUpperCase()}`;

        return { result };
    },
};
```

4. Create the plugin entry point:

```typescript
// src/index.ts
import { Plugin } from "@elizaos/core";
import { customAction } from "./actions/customAction";

class CustomPlugin implements Plugin {
    name = "custom";
    version = "0.1.0";
    description = "A custom plugin with special actions";

    actions = [customAction];
}

export default CustomPlugin;
```

5. Add your custom plugin to your agent:

```typescript
import CustomPlugin from './plugins/custom';

// ...

plugins: [
  new WebSearchPlugin(),
  new TwitterPlugin(),
  new CustomPlugin(),
],
```

## Step 8: Deploy Your Agent

Once you've customized your agent to your liking, you can deploy it to a server:

1. Build the project:

```bash
pnpm build
```

2. Set up environment variables on your server:

```
NODE_ENV=production
OPENAI_API_KEY=your-api-key
# Other environment variables...
```

3. Start the agent and client:

```bash
pnpm start
pnpm start:client
```

You can use process managers like PM2 to keep your agent running:

```bash
npm install -g pm2
pm2 start "pnpm start" --name elizaos-agent
pm2 start "pnpm start:client" --name elizaos-client
```

## Conclusion

Congratulations! You've created your first agent with ElizaOS. You've learned how to:

-   Set up the ElizaOS environment
-   Configure your agent
-   Add plugins to extend your agent's capabilities
-   Customize your agent's behavior
-   Create custom actions
-   Deploy your agent

From here, you can continue to enhance your agent by:

-   Creating more sophisticated custom actions
-   Integrating with additional external services
-   Fine-tuning your agent's personality and responses
-   Building a custom frontend for your agent

For more advanced topics, check out the other tutorials and documentation in the ElizaOS repository.
