# Building a Custom Plugin for ElizaOS

This tutorial will guide you through the process of creating a custom plugin for ElizaOS. By the end, you'll have a fully functional plugin that extends the capabilities of your AI agent.

## Prerequisites

Before you begin, make sure you have the following:

-   A working ElizaOS installation
-   Node.js v23.3.0 or higher installed
-   pnpm v8.0.0 or higher installed
-   A basic understanding of TypeScript
-   Familiarity with the ElizaOS architecture

## Overview of the Plugin System

ElizaOS plugins are modular components that extend the functionality of the agent. Plugins can:

-   Add new actions that the agent can perform
-   Provide data or services to the agent
-   Evaluate agent responses or user inputs
-   Connect to external systems or APIs

In this tutorial, we'll create a "Reminder" plugin that allows the agent to set, list, and delete reminders.

## Step 1: Set Up the Plugin Project

First, create a new directory for your plugin:

```bash
mkdir -p packages/plugin-reminder
cd packages/plugin-reminder
```

Initialize a new package:

```bash
pnpm init
```

Install the required dependencies:

```bash
pnpm add -D typescript tsup @types/node
pnpm add date-fns
```

## Step 2: Configure the Build System

Create a `tsconfig.json` file:

```json
{
    "compilerOptions": {
        "target": "ES2020",
        "module": "ESNext",
        "moduleResolution": "node",
        "esModuleInterop": true,
        "outDir": "dist",
        "declaration": true,
        "strict": true
    },
    "include": ["src/**/*"]
}
```

Create a `tsup.config.ts` file:

```typescript
import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    outDir: "dist",
    format: ["esm"],
    dts: true,
    clean: true,
    external: ["@elizaos/core", "date-fns"],
});
```

Update the `package.json` file:

```json
{
    "name": "@elizaos-plugins/plugin-reminder",
    "version": "0.1.0",
    "type": "module",
    "main": "dist/index.js",
    "module": "dist/index.js",
    "types": "dist/index.d.ts",
    "exports": {
        "./package.json": "./package.json",
        ".": {
            "import": {
                "@elizaos/source": "./src/index.ts",
                "types": "./dist/index.d.ts",
                "default": "./dist/index.js"
            }
        }
    },
    "files": ["dist"],
    "scripts": {
        "build": "tsup",
        "test": "vitest run",
        "test:watch": "vitest"
    },
    "dependencies": {
        "date-fns": "^2.30.0"
    },
    "peerDependencies": {
        "@elizaos/core": "workspace:*"
    },
    "devDependencies": {
        "@elizaos/core": "workspace:*",
        "@types/node": "^22.0.0",
        "tsup": "^8.0.0",
        "typescript": "^5.0.0",
        "vitest": "^1.0.0"
    }
}
```

## Step 3: Define the Plugin Types

Create a `src` directory and add a `types.ts` file:

```typescript
export interface Reminder {
    id: string;
    userId: string;
    agentId: string;
    text: string;
    dueDate: Date;
    isCompleted: boolean;
    createdAt: Date;
}

export interface ReminderPluginConfig {
    storageKey?: string;
}
```

## Step 4: Implement the Storage Service

Create a `src/services` directory and add a `reminderStorage.ts` file:

```typescript
import { IAgentRuntime } from "@elizaos/core";
import { Reminder } from "../types";

export class ReminderStorage {
    private runtime: IAgentRuntime;
    private storageKey: string;

    constructor(runtime: IAgentRuntime, storageKey = "reminders") {
        this.runtime = runtime;
        this.storageKey = storageKey;
    }

    async getAll(userId: string): Promise<Reminder[]> {
        const reminders =
            (await this.runtime.getSetting(this.storageKey)) || "[]";
        const parsed = JSON.parse(reminders) as Reminder[];
        return parsed.filter((reminder) => reminder.userId === userId);
    }

    async getById(userId: string, id: string): Promise<Reminder | undefined> {
        const reminders = await this.getAll(userId);
        return reminders.find((reminder) => reminder.id === id);
    }

    async add(reminder: Reminder): Promise<Reminder> {
        const reminders = await this.getAllReminders();
        reminders.push(reminder);
        await this.saveReminders(reminders);
        return reminder;
    }

    async update(
        userId: string,
        id: string,
        updates: Partial<Reminder>
    ): Promise<Reminder | undefined> {
        const reminders = await this.getAllReminders();
        const index = reminders.findIndex(
            (r) => r.id === id && r.userId === userId
        );

        if (index === -1) {
            return undefined;
        }

        reminders[index] = { ...reminders[index], ...updates };
        await this.saveReminders(reminders);
        return reminders[index];
    }

    async delete(userId: string, id: string): Promise<boolean> {
        const reminders = await this.getAllReminders();
        const initialLength = reminders.length;
        const filtered = reminders.filter(
            (r) => !(r.id === id && r.userId === userId)
        );

        if (filtered.length === initialLength) {
            return false;
        }

        await this.saveReminders(filtered);
        return true;
    }

    private async getAllReminders(): Promise<Reminder[]> {
        const reminders =
            (await this.runtime.getSetting(this.storageKey)) || "[]";
        return JSON.parse(reminders) as Reminder[];
    }

    private async saveReminders(reminders: Reminder[]): Promise<void> {
        await this.runtime.setSetting(
            this.storageKey,
            JSON.stringify(reminders)
        );
    }
}
```

## Step 5: Implement the Plugin Actions

Create a `src/actions` directory and add the following files:

### `src/actions/setReminder.ts`

```typescript
import { Action } from "@elizaos/core";
import { parseISO, isValid } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { ReminderStorage } from "../services/reminderStorage";

export const setReminderAction: Action = {
    name: "setReminder",
    description: "Set a reminder for a specific date and time",
    parameters: {
        type: "object",
        properties: {
            text: {
                type: "string",
                description: "The text of the reminder",
            },
            dueDate: {
                type: "string",
                description:
                    "The due date of the reminder in ISO format (YYYY-MM-DDTHH:MM:SS)",
            },
        },
        required: ["text", "dueDate"],
    },

    async execute(params, context) {
        const { text, dueDate } = params;
        const { agent, message } = context;

        if (!message || !message.userId) {
            throw new Error("User ID is required");
        }

        const parsedDate = parseISO(dueDate);
        if (!isValid(parsedDate)) {
            return {
                error: "Invalid date format. Please use ISO format (YYYY-MM-DDTHH:MM:SS).",
            };
        }

        const storage = new ReminderStorage(
            agent,
            context.plugin.config?.storageKey
        );

        const reminder = {
            id: uuidv4(),
            userId: message.userId,
            agentId: agent.agentId,
            text,
            dueDate: parsedDate,
            isCompleted: false,
            createdAt: new Date(),
        };

        await storage.add(reminder);

        return {
            success: true,
            reminder: {
                id: reminder.id,
                text: reminder.text,
                dueDate: reminder.dueDate.toISOString(),
            },
        };
    },
};
```

### `src/actions/listReminders.ts`

```typescript
import { Action } from "@elizaos/core";
import { format } from "date-fns";
import { ReminderStorage } from "../services/reminderStorage";

export const listRemindersAction: Action = {
    name: "listReminders",
    description: "List all reminders for the current user",
    parameters: {
        type: "object",
        properties: {
            showCompleted: {
                type: "boolean",
                description: "Whether to include completed reminders",
                default: false,
            },
        },
        required: [],
    },

    async execute(params, context) {
        const { showCompleted = false } = params;
        const { agent, message } = context;

        if (!message || !message.userId) {
            throw new Error("User ID is required");
        }

        const storage = new ReminderStorage(
            agent,
            context.plugin.config?.storageKey
        );
        let reminders = await storage.getAll(message.userId);

        if (!showCompleted) {
            reminders = reminders.filter((r) => !r.isCompleted);
        }

        return {
            reminders: reminders.map((r) => ({
                id: r.id,
                text: r.text,
                dueDate: format(r.dueDate, "PPpp"),
                isCompleted: r.isCompleted,
            })),
            count: reminders.length,
        };
    },
};
```

### `src/actions/completeReminder.ts`

```typescript
import { Action } from "@elizaos/core";
import { ReminderStorage } from "../services/reminderStorage";

export const completeReminderAction: Action = {
    name: "completeReminder",
    description: "Mark a reminder as completed",
    parameters: {
        type: "object",
        properties: {
            id: {
                type: "string",
                description: "The ID of the reminder to complete",
            },
        },
        required: ["id"],
    },

    async execute(params, context) {
        const { id } = params;
        const { agent, message } = context;

        if (!message || !message.userId) {
            throw new Error("User ID is required");
        }

        const storage = new ReminderStorage(
            agent,
            context.plugin.config?.storageKey
        );
        const reminder = await storage.update(message.userId, id, {
            isCompleted: true,
        });

        if (!reminder) {
            return { error: `Reminder with ID ${id} not found` };
        }

        return {
            success: true,
            reminder: {
                id: reminder.id,
                text: reminder.text,
                dueDate: reminder.dueDate.toISOString(),
                isCompleted: reminder.isCompleted,
            },
        };
    },
};
```

### `src/actions/deleteReminder.ts`

```typescript
import { Action } from "@elizaos/core";
import { ReminderStorage } from "../services/reminderStorage";

export const deleteReminderAction: Action = {
    name: "deleteReminder",
    description: "Delete a reminder",
    parameters: {
        type: "object",
        properties: {
            id: {
                type: "string",
                description: "The ID of the reminder to delete",
            },
        },
        required: ["id"],
    },

    async execute(params, context) {
        const { id } = params;
        const { agent, message } = context;

        if (!message || !message.userId) {
            throw new Error("User ID is required");
        }

        const storage = new ReminderStorage(
            agent,
            context.plugin.config?.storageKey
        );
        const success = await storage.delete(message.userId, id);

        if (!success) {
            return { error: `Reminder with ID ${id} not found` };
        }

        return {
            success: true,
            message: `Reminder with ID ${id} has been deleted`,
        };
    },
};
```

### `src/actions/index.ts`

```typescript
export * from "./setReminder";
export * from "./listReminders";
export * from "./completeReminder";
export * from "./deleteReminder";
```

## Step 6: Create the Plugin Class

Create a `src/index.ts` file:

```typescript
import { Plugin } from "@elizaos/core";
import {
    setReminderAction,
    listRemindersAction,
    completeReminderAction,
    deleteReminderAction,
} from "./actions";
import { ReminderPluginConfig } from "./types";

class ReminderPlugin implements Plugin {
    name = "reminder";
    version = "0.1.0";
    description = "A plugin that provides reminder functionality";
    config?: ReminderPluginConfig;

    constructor(config?: ReminderPluginConfig) {
        this.config = config;
    }

    actions = [
        setReminderAction,
        listRemindersAction,
        completeReminderAction,
        deleteReminderAction,
    ];
}

export default ReminderPlugin;
export * from "./types";
```

## Step 7: Build the Plugin

Build your plugin:

```bash
pnpm build
```

## Step 8: Add the Plugin to Your Agent

Now you can add your plugin to your agent. Edit your agent configuration file:

```typescript
import { Character } from "@elizaos/core";
import ReminderPlugin from "@elizaos-plugins/plugin-reminder";

export const myAgent: Character = {
    name: "MyAgent",
    description: "A helpful assistant that can manage reminders",

    system: `You are MyAgent, a helpful and friendly AI assistant.
You can set reminders for users, list their reminders, mark reminders as completed, and delete reminders.
Always confirm when a reminder has been set, completed, or deleted.`,

    modelProvider: {
        name: "openai",
        model: "gpt-4",
        temperature: 0.7,
    },

    plugins: [
        new ReminderPlugin({
            storageKey: "my_agent_reminders",
        }),
        // Other plugins...
    ],
};
```

## Step 9: Test Your Plugin

Start your agent:

```bash
pnpm start
```

In a separate terminal, start the client:

```bash
pnpm start:client
```

Visit `http://localhost:5173` in your browser and test your plugin with the following interactions:

1. Set a reminder:

    ```
    Please set a reminder for me to call John tomorrow at 2pm
    ```

2. List reminders:

    ```
    What reminders do I have?
    ```

3. Complete a reminder:

    ```
    I've completed the reminder to call John
    ```

4. Delete a reminder:
    ```
    Delete the reminder about calling John
    ```

## Step 10: Add a Service for Due Reminder Notifications

Let's enhance our plugin by adding a service that checks for due reminders and notifies the user:

Create a `src/services/reminderNotifier.ts` file:

```typescript
import { Service, IAgentRuntime } from "@elizaos/core";
import { differenceInMilliseconds, isPast } from "date-fns";
import { ReminderStorage } from "./reminderStorage";

export class ReminderNotifier implements Service {
    name = "reminderNotifier";
    private runtime: IAgentRuntime;
    private storage: ReminderStorage;
    private checkInterval: NodeJS.Timeout | null = null;
    private intervalMs = 60000; // Check every minute

    constructor(runtime: IAgentRuntime, storageKey?: string) {
        this.runtime = runtime;
        this.storage = new ReminderStorage(runtime, storageKey);
    }

    async start(): Promise<void> {
        this.checkInterval = setInterval(
            () => this.checkReminders(),
            this.intervalMs
        );
    }

    async stop(): Promise<void> {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }

    private async checkReminders(): Promise<void> {
        try {
            // Get all reminders from all users
            const allReminders = await this.storage.getAllReminders();
            const now = new Date();

            // Find due reminders that aren't completed
            const dueReminders = allReminders.filter(
                (reminder) =>
                    !reminder.isCompleted &&
                    isPast(reminder.dueDate) &&
                    differenceInMilliseconds(now, reminder.dueDate) <
                        this.intervalMs
            );

            // Notify users about due reminders
            for (const reminder of dueReminders) {
                await this.notifyUser(reminder);
                await this.storage.update(reminder.userId, reminder.id, {
                    isCompleted: true,
                });
            }
        } catch (error) {
            console.error("Error checking reminders:", error);
        }
    }

    private async notifyUser(reminder: Reminder): Promise<void> {
        try {
            // Find the room for this user
            const rooms = await this.runtime.getRooms();
            const userRoom = rooms.find((room) =>
                room.participants.some((p) => p.userId === reminder.userId)
            );

            if (!userRoom) {
                console.warn(`No room found for user ${reminder.userId}`);
                return;
            }

            // Send a message to the room
            await this.runtime.sendMessage({
                roomId: userRoom.id,
                content: {
                    type: "text",
                    text: `🔔 Reminder: ${reminder.text}`,
                },
                metadata: {
                    isNotification: true,
                    reminderNotification: true,
                    reminderId: reminder.id,
                },
            });
        } catch (error) {
            console.error("Error notifying user about reminder:", error);
        }
    }
}
```

Update the `src/index.ts` file to include the service:

```typescript
import { Plugin } from "@elizaos/core";
import {
    setReminderAction,
    listRemindersAction,
    completeReminderAction,
    deleteReminderAction,
} from "./actions";
import { ReminderNotifier } from "./services/reminderNotifier";
import { ReminderPluginConfig } from "./types";

class ReminderPlugin implements Plugin {
    name = "reminder";
    version = "0.1.0";
    description = "A plugin that provides reminder functionality";
    config?: ReminderPluginConfig;

    constructor(config?: ReminderPluginConfig) {
        this.config = config;
    }

    actions = [
        setReminderAction,
        listRemindersAction,
        completeReminderAction,
        deleteReminderAction,
    ];

    services = [
        {
            create: (runtime) =>
                new ReminderNotifier(runtime, this.config?.storageKey),
        },
    ];
}

export default ReminderPlugin;
export * from "./types";
```

## Conclusion

Congratulations! You've created a custom reminder plugin for ElizaOS that:

1. Allows users to set reminders
2. Lists all reminders
3. Marks reminders as completed
4. Deletes reminders
5. Automatically notifies users when reminders are due

This plugin demonstrates several key concepts of the ElizaOS plugin system:

-   Creating custom actions
-   Implementing storage services
-   Adding background services
-   Sending messages to users

You can extend this plugin further by adding features such as:

-   Recurring reminders
-   Reminder categories
-   Reminder priorities
-   Snooze functionality
-   Sharing reminders with other users

For more advanced plugin development, check out the ElizaOS Plugin API documentation.
