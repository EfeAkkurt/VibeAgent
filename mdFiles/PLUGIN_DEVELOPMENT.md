# ElizaOS Plugin Development Guide

This document provides a comprehensive guide on how to develop plugins for the ElizaOS agent platform. It covers the plugin architecture, development workflow, and best practices.

## Table of Contents

-   [Plugin System Overview](#plugin-system-overview)
-   [Plugin Types](#plugin-types)
-   [Creating Your First Plugin](#creating-your-first-plugin)
-   [Plugin Structure](#plugin-structure)
-   [Plugin API Reference](#plugin-api-reference)
-   [Testing Plugins](#testing-plugins)
-   [Publishing Plugins](#publishing-plugins)
-   [Best Practices](#best-practices)

## Plugin System Overview

ElizaOS features a modular plugin system that allows developers to extend the functionality of the agent platform. Plugins can add new capabilities, integrate with external services, or modify the behavior of the agent.

### Plugin Architecture

The plugin system follows a component-based architecture:

```
┌─────────────────────────┐
│      Plugin Package     │
├─────────────────────────┤
│                         │
│  ┌───────────────────┐  │
│  │  Plugin Manifest  │  │
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │
│  │  Core Components  │  │
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │
│  │  Plugin-specific  │  │
│  │    Components     │  │
│  └───────────────────┘  │
│                         │
└─────────────────────────┘
```

### Plugin Lifecycle

1. **Registration**: Plugin is registered with the agent runtime
2. **Initialization**: Plugin is initialized with configuration
3. **Activation**: Plugin components are activated
4. **Execution**: Plugin components are executed as needed
5. **Deactivation**: Plugin is deactivated when no longer needed

## Plugin Types

ElizaOS supports several types of plugins:

### 1. Action Plugins

Action plugins provide new actions that the agent can perform. These are typically capabilities that the agent can use to interact with external systems or perform specialized tasks.

```typescript
interface Action {
    name: string;
    description: string;
    parameters: Schema;
    execute: (params: any, context: ActionContext) => Promise<any>;
}
```

### 2. Provider Plugins

Provider plugins supply data or services to the agent. These can include model providers, data sources, or other services.

```typescript
interface Provider {
    name: string;
    description: string;
    provide: (request: any, context: ProviderContext) => Promise<any>;
}
```

### 3. Evaluator Plugins

Evaluator plugins evaluate agent responses or user inputs. These can be used to enforce policies, detect harmful content, or improve response quality.

```typescript
interface Evaluator {
    name: string;
    description: string;
    evaluate: (
        input: any,
        context: EvaluatorContext
    ) => Promise<EvaluationResult>;
}
```

### 4. Client Plugins

Client plugins connect to external systems or APIs. These provide interfaces for the agent to interact with external services.

```typescript
interface Client {
    name: string;
    description?: string;
    start: (runtime: IAgentRuntime) => Promise<ClientInstance>;
}

interface ClientInstance {
    stop: () => Promise<void>;
}
```

## Creating Your First Plugin

Let's walk through creating a simple weather plugin that allows the agent to fetch weather information:

### 1. Set Up the Project

Create a new directory for your plugin:

```bash
mkdir elizaos-plugin-weather
cd elizaos-plugin-weather
pnpm init
```

Install required dependencies:

```bash
pnpm add @elizaos/core axios
pnpm add -D typescript tsup @types/node
```

### 2. Create the Plugin Structure

Create the following file structure:

```
elizaos-plugin-weather/
├── src/
│   ├── index.ts
│   ├── actions/
│   │   └── getWeather.ts
│   └── types.ts
├── tsconfig.json
├── tsup.config.ts
└── package.json
```

### 3. Define the Plugin Interface

Create `src/types.ts`:

```typescript
export interface WeatherData {
    location: string;
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
}

export interface WeatherPluginConfig {
    apiKey: string;
    units: "metric" | "imperial";
}
```

### 4. Implement the Weather Action

Create `src/actions/getWeather.ts`:

```typescript
import { Action } from "@elizaos/core";
import axios from "axios";
import { WeatherData, WeatherPluginConfig } from "../types";

export const getWeatherAction: Action = {
    name: "getWeather",
    description: "Get current weather information for a location",
    parameters: {
        type: "object",
        properties: {
            location: {
                type: "string",
                description: "The city name or location to get weather for",
            },
        },
        required: ["location"],
    },

    async execute(params, context) {
        const { location } = params;
        const config = context.plugin.config as WeatherPluginConfig;

        if (!config.apiKey) {
            throw new Error("Weather API key not configured");
        }

        try {
            const response = await axios.get(
                "https://api.openweathermap.org/data/2.5/weather",
                {
                    params: {
                        q: location,
                        appid: config.apiKey,
                        units: config.units || "metric",
                    },
                }
            );

            const data = response.data;

            const weatherData: WeatherData = {
                location: data.name,
                temperature: data.main.temp,
                condition: data.weather[0].description,
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
            };

            return weatherData;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return { error: `Location "${location}" not found` };
            }
            throw error;
        }
    },
};
```

### 5. Create the Plugin Entry Point

Create `src/index.ts`:

```typescript
import { Plugin } from "@elizaos/core";
import { getWeatherAction } from "./actions/getWeather";
import { WeatherPluginConfig } from "./types";

class WeatherPlugin implements Plugin {
    name = "weather";
    version = "0.1.0";
    description = "A plugin that provides weather information";
    config?: WeatherPluginConfig;

    constructor(config?: WeatherPluginConfig) {
        this.config = config;
    }

    actions = [getWeatherAction];
}

export default WeatherPlugin;
export * from "./types";
```

### 6. Configure the Build

Create `tsconfig.json`:

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

Create `tsup.config.ts`:

```typescript
import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    outDir: "dist",
    format: ["esm"],
    dts: true,
    clean: true,
    external: ["@elizaos/core", "axios"],
});
```

Update `package.json`:

```json
{
    "name": "@elizaos-plugins/plugin-weather",
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
        "axios": "^0.28.0"
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

### 7. Build the Plugin

```bash
pnpm build
```

## Plugin Structure

A typical ElizaOS plugin has the following structure:

### Core Files

-   **index.ts**: Main entry point that exports the plugin class
-   **types.ts**: TypeScript interfaces and types for the plugin
-   **actions/**: Directory containing action implementations
-   **providers/**: Directory containing provider implementations
-   **evaluators/**: Directory containing evaluator implementations
-   **clients/**: Directory containing client implementations

### Supporting Files

-   **utils/**: Utility functions
-   **constants.ts**: Constants used throughout the plugin
-   **config.ts**: Configuration schema and defaults

## Plugin API Reference

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

### Action Interface

```typescript
export interface Action {
    name: string;
    description: string;
    parameters: Schema;
    execute: (params: any, context: ActionContext) => Promise<any>;
}

export interface ActionContext {
    agent: IAgentRuntime;
    plugin: Plugin;
    message?: Memory;
    state?: State;
}
```

### Provider Interface

```typescript
export interface Provider {
    name: string;
    description: string;
    provide: (request: any, context: ProviderContext) => Promise<any>;
}

export interface ProviderContext {
    agent: IAgentRuntime;
    plugin: Plugin;
}
```

### Client Interface

```typescript
export interface Client {
    name: string;
    description?: string;
    start: (runtime: IAgentRuntime) => Promise<ClientInstance>;
}

export interface ClientInstance {
    stop: () => Promise<void>;
}
```

## Testing Plugins

ElizaOS provides utilities for testing plugins:

### Unit Testing

```typescript
import { describe, it, expect, vi } from "vitest";
import { getWeatherAction } from "../src/actions/getWeather";
import axios from "axios";

// Mock axios
vi.mock("axios");

describe("getWeather action", () => {
    it("should return weather data for a valid location", async () => {
        // Mock axios response
        (axios.get as any).mockResolvedValue({
            data: {
                name: "London",
                main: {
                    temp: 15.5,
                    humidity: 76,
                },
                weather: [
                    {
                        description: "cloudy",
                    },
                ],
                wind: {
                    speed: 5.2,
                },
            },
        });

        const result = await getWeatherAction.execute({ location: "London" }, {
            plugin: {
                config: {
                    apiKey: "test-api-key",
                    units: "metric",
                },
            },
        } as any);

        expect(result).toEqual({
            location: "London",
            temperature: 15.5,
            condition: "cloudy",
            humidity: 76,
            windSpeed: 5.2,
        });

        expect(axios.get).toHaveBeenCalledWith(
            "https://api.openweathermap.org/data/2.5/weather",
            {
                params: {
                    q: "London",
                    appid: "test-api-key",
                    units: "metric",
                },
            }
        );
    });
});
```

### Integration Testing

```typescript
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createTestAgentRuntime } from "@elizaos/core/testing";
import WeatherPlugin from "../src";

describe("Weather Plugin Integration", () => {
    let runtime;
    let plugin;

    beforeAll(async () => {
        // Create test runtime
        runtime = await createTestAgentRuntime();

        // Create and register plugin
        plugin = new WeatherPlugin({
            apiKey: process.env.WEATHER_API_KEY || "test-key",
            units: "metric",
        });

        await runtime.registerPlugin(plugin);
    });

    afterAll(async () => {
        await runtime.shutdown();
    });

    it("should execute getWeather action", async () => {
        const result = await runtime.executeAction("getWeather", {
            location: "London",
        });

        expect(result).toHaveProperty("location");
        expect(result).toHaveProperty("temperature");
        expect(result).toHaveProperty("condition");
    });
});
```

## Publishing Plugins

To publish your plugin:

1. **Prepare the package**:

    ```bash
    pnpm build
    ```

2. **Update version**:

    ```bash
    pnpm version patch
    ```

3. **Publish to npm**:
    ```bash
    pnpm publish --access public
    ```

### Private Plugins

For private plugins, you can:

1. Publish to a private npm registry
2. Use as a local package in your project

## Best Practices

### Plugin Development

1. **Single Responsibility**: Each plugin should have a clear, focused purpose
2. **Error Handling**: Implement comprehensive error handling
3. **Configuration Validation**: Validate plugin configuration
4. **Documentation**: Document your plugin's functionality and API
5. **Testing**: Write tests for your plugin

### Performance

1. **Minimize Dependencies**: Use lightweight dependencies
2. **Optimize Network Requests**: Cache responses and minimize API calls
3. **Resource Management**: Release resources when no longer needed

### Security

1. **Input Validation**: Validate all inputs to prevent injection attacks
2. **Secure Storage**: Store sensitive data securely
3. **Rate Limiting**: Implement rate limiting for external API calls
4. **Error Masking**: Don't expose sensitive information in error messages

### Compatibility

1. **Version Compatibility**: Specify compatible ElizaOS versions
2. **Graceful Degradation**: Handle missing dependencies gracefully
3. **Feature Detection**: Use feature detection instead of version checking

## Conclusion

This guide provides a comprehensive overview of developing plugins for ElizaOS. By following these guidelines, you can create powerful extensions that enhance the capabilities of the agent platform.

For more information, refer to the API documentation and examples in the ElizaOS repository.
