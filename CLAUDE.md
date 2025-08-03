# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AgentOS is an operating system designed specifically for AI coding agents, providing:

- **Memory Engine**: Persistent memory storage with SQLite database (`agentos-memory.db`)
- **Execution Engine**: Sandboxed code execution using Docker containers with fallback to mock execution
- **Learning Engine**: Pattern recognition and success prediction using machine learning
- **CLI Interface**: Command-line tools for agent interactions

## Essential Commands

### Build & Development
```bash
npm run build          # Compile TypeScript to JavaScript in dist/
npm run dev            # Run development server with ts-node
npm start              # Run compiled version from dist/
npm run prepare        # Prepare for publishing (runs build)
```

### Testing & Quality
```bash
npm test               # Run Jest tests
npm test:watch         # Run Jest in watch mode
npm run lint           # Run ESLint on TypeScript files
npm run lint:fix       # Auto-fix linting issues
```

### CLI Usage
```bash
agentos init                           # Initialize AgentOS
agentos memory store "message"         # Store memory
agentos execute --language js --code "console.log('test')"  # Execute code
```

## Architecture

### Core System (`src/core/`)

**AgentOS.ts** - Main orchestrator class that coordinates all subsystems:
- Initializes Memory, Execution, and Learning engines
- Provides unified API for remember(), recall(), execute(), verify()
- Handles agent/project context and configuration
- Line 53: `initialize()` method sets up all engines

**MemoryEngine.ts** - Enhanced persistent memory system:
- SQLite database with FTS5 full-text search and semantic relationships
- Line 40: Database schema with memories and memory_relationships tables
- Line 132: `store()` method for saving memories with metadata
- Line 224: `search()` method with relevance scoring and context matching

**ExecutionEngine.ts** - Sandboxed code execution:
- Docker containers for secure code execution (with mock fallback)
- Line 51: `execute()` method handles multi-language code execution
- Line 313: Language-specific Docker images (Node.js, Python, Go, etc.)
- Line 170: Container security settings (no network, memory limits, read-only)

**LearningEngine.ts** - Pattern recognition and ML predictions:
- Line 103: `predictSuccess()` calculates probability using trained model
- Line 154: `learnFromExecution()` updates model weights via gradient descent
- Line 81: `extractCodeFeatures()` analyzes code complexity, patterns, keywords

### Type System (`src/types/index.ts`)
Comprehensive TypeScript definitions for all system interfaces including Memory, ExecutionRequest, CodeSuggestion, and API responses.

### CLI Interface (`src/cli.ts`)
Command-line interface using Commander.js for agent interactions.

## Development Notes

- **Database**: SQLite database persists at `./agentos-memory.db` with WAL mode enabled
- **Docker Requirement**: Full execution requires Docker Desktop running; falls back to mock execution
- **Memory Context**: All operations are scoped by agentId and projectId for isolation
- **Error Handling**: Comprehensive error handling with ApiResponse<T> wrapper pattern
- **Async/Await**: All core methods are async and return ApiResponse objects

## Language Support

Execution Engine supports: JavaScript, TypeScript, Python, Go, Rust, Java, C#

Each language has specific Docker images and execution commands configured in ExecutionEngine.ts:330-342.